const QuizAttempt = require("../models/QuizAttempt");
const { generateQuizQuestions } = require("../utils/groq");

const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"];

// @route POST /api/quiz/generate
// body: { topic, difficulty, numQuestions }
const generateQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }
    if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ message: "Difficulty must be easy, medium, or hard" });
    }
    const count = parseInt(numQuestions, 10);
    if (!count || count < 1 || count > 25) {
      return res.status(400).json({ message: "numQuestions must be between 1 and 25" });
    }

    const questions = await generateQuizQuestions({
      topic: topic.trim(),
      difficulty,
      numQuestions: count,
    });

    if (!questions.length) {
      return res.status(502).json({ message: "AI service returned no usable questions. Please try again." });
    }

    res.json({ topic: topic.trim(), difficulty, numQuestions: questions.length, questions });
  } catch (error) {
    console.error("Quiz generation error:", error.message);
    res.status(502).json({ message: "Failed to generate quiz questions from AI service. Please try again." });
  }
};

// @route POST /api/quiz/submit
// body: { topic, difficulty, numQuestions, timeTakenSeconds, answers: [{question, options, correctAnswer, explanation, userAnswer}] }
const submitQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty, numQuestions, timeTakenSeconds, answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const gradedAnswers = answers.map((a) => ({
      question: a.question,
      options: a.options,
      correctAnswer: a.correctAnswer,
      userAnswer: a.userAnswer ?? null,
      explanation: a.explanation || "",
      isCorrect: a.userAnswer != null && a.userAnswer === a.correctAnswer,
    }));

    const score = gradedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = gradedAnswers.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      topic,
      difficulty,
      numQuestions: numQuestions || totalQuestions,
      score,
      totalQuestions,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0,
      answers: gradedAnswers,
    });

    res.status(201).json({ attempt });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateQuiz, submitQuiz };
