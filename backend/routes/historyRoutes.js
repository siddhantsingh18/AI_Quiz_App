const express = require("express");
const { getHistory, getAttemptById, getStats } = require("../controllers/historyController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/stats/summary", protect, getStats);
router.get("/:id", protect, getAttemptById);

module.exports = router;
