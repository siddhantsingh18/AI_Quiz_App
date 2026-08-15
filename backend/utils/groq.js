const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

/**
 * Generates quiz questions using Groq AI.
 * Returns an array of: { question, options: [4 strings], correctAnswer, explanation }
 */
async function generateQuizQuestions({ topic, difficulty, numQuestions }) {
  const systemPrompt = `You are an expert quiz generator. You create high-quality, factually accurate multiple-choice questions.
Always respond with STRICT JSON only — no markdown, no code fences, no commentary.`;

  const userPrompt = `Generate ${numQuestions} multiple-choice quiz questions on the topic "${topic}" at "${difficulty}" difficulty level.

Rules:
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- Include a short explanation (1-2 sentences) for why the correct answer is correct.
- Questions must be relevant, unambiguous, and appropriate for the "${difficulty}" difficulty level.
- Do not repeat questions.

Respond with ONLY valid JSON in this exact shape, no other text:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string (must exactly match one of the options)",
      "explanation": "string"
    }
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq API");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const questions = parsed.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("AI response did not include a valid questions array");
  }

  // Basic validation/sanitization
  return questions
    .filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.correctAnswer === "string"
    )
    .slice(0, numQuestions)
    .map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
    }));
}

module.exports = { generateQuizQuestions };
