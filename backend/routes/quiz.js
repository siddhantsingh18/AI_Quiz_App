import express from 'express';
import { protect } from '../middleware/auth.js';
import QuizResult from '../models/QuizResult.js';

// // DEBUG: Check if API key is loading
 console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY?.length);

const router = express.Router();


async function askGroq(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'qwen/qwen3-32b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// GENERATE QUIZ QUESTIONS
router.post('/generate', protect, async (req, res) => {
  try {
    const { topic, numQuestions = 5, difficulty = 'medium' } = req.body;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const prompt = `Generate exactly ${numQuestions} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level.

Return ONLY a valid JSON array with no markdown, no code blocks, no extra text. Format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
]

Rules:
- Exactly 4 options per question
- correctAnswer must exactly match one of the options
- Make questions educational and accurate about ${topic}
- Vary difficulty within the ${difficulty} range`;

    const text = await askGroq(prompt);

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const questions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions generated');
    }

    res.json({ questions, topic, difficulty });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ message: 'Failed to generate questions: ' + err.message });
  }
});

//SUBMIT QUIZ AND GET FEEDBACK
router.post('/submit', protect, async (req, res) => {
  try {
    const { topic, questions, userAnswers, timeTaken } = req.body;

    let correctCount = 0;
    const questionResults = questions.map((q, i) => {
      const isCorrect = q.correctAnswer === userAnswers[i];
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswers[i] || 'Not answered',
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    const wrongTopics = questionResults
      .filter(q => !q.isCorrect)
      .map(q => q.question)
      .join('; ');

    const feedbackPrompt = `A student took a quiz on "${topic}" and scored ${score}% (${correctCount}/${questions.length} correct).
${wrongTopics ? `They got these questions wrong: ${wrongTopics}` : 'They answered all questions correctly!'}

Give a brief, encouraging 2-3 sentence personalized feedback message. Be specific about their performance and give 1 actionable improvement tip if they got any wrong. Keep it motivating and concise.`;

    const feedback = await askGroq(feedbackPrompt);

    const quizResult = await QuizResult.create({
      userId: req.user._id,
      topic,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score,
      timeTaken,
      questions: questionResults,
      feedback,
    });

    res.json({
      score,
      correctCount,
      totalQuestions: questions.length,
      feedback,
      questionResults,
      resultId: quizResult._id,
    });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ message: 'Failed to submit quiz: ' + err.message });
  }
});

//QUIZ HISTORY
router.get('/history', protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('topic score totalQuestions correctAnswers timeTaken createdAt');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//LEADERBOARD
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: '$userId',
          totalQuizzes:   { $sum: 1 },
          avgScore:       { $avg: '$score' },
          bestScore:      { $max: '$score' },
          totalQuestions: { $sum: '$totalQuestions' },
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          username:       '$user.username',
          totalQuizzes:   1,
          avgScore:       { $round: ['$avgScore', 1] },
          bestScore:      1,
          totalQuestions: 1,
        },
      },
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//USER STATS
router.get('/stats', protect, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });

    if (!results.length) {
      return res.json({
        totalQuizzes: 0, avgScore: 0, bestScore: 0,
        totalQuestions: 0, topTopics: [], streak: 0,
      });
    }

    const avgScore       = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
    const bestScore      = Math.max(...results.map(r => r.score));
    const totalQuestions = results.reduce((s, r) => s + r.totalQuestions, 0);

    const topicMap = {};
    results.forEach(r => { topicMap[r.topic] = (topicMap[r.topic] || 0) + 1; });
    const topTopics = Object.entries(topicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    const dates = [
      ...new Set(results.map(r => new Date(r.createdAt).toDateString())),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();

    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const diff = (new Date(dates[i - 1]) - new Date(dates[i])) / 86_400_000;
        if (diff === 1) streak++;
        else break;
      }
    }

    res.json({ totalQuizzes: results.length, avgScore, bestScore, totalQuestions, topTopics, streak });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
