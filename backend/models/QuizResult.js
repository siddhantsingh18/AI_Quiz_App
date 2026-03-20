import mongoose from 'mongoose';

const questionResultSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  userAnswer: String,
  isCorrect: Boolean,
  explanation: String
});

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number,
  timeTaken: Number,
  questions: [questionResultSchema],
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('QuizResult', quizResultSchema);
