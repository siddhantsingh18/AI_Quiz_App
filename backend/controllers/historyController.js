const QuizAttempt = require("../models/QuizAttempt");

// @route GET /api/history
const getHistory = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("-answers");
    res.json({ attempts });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/history/:id
const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findOne({ _id: req.params.id, user: req.user._id });
    if (!attempt) {
      return res.status(404).json({ message: "Quiz attempt not found" });
    }
    res.json({ attempt });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/history/stats/summary
const getStats = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id });
    const totalAttempts = attempts.length;
    const averagePercentage = totalAttempts
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
      : 0;
    const bestPercentage = totalAttempts ? Math.max(...attempts.map((a) => a.percentage)) : 0;
    const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);

    res.json({ totalAttempts, averagePercentage, bestPercentage, totalQuestionsAnswered });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, getAttemptById, getStats };
