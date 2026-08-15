const express = require("express");
const { generateQuiz, submitQuiz } = require("../controllers/quizController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitQuiz);

module.exports = router;
