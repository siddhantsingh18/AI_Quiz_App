import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const POPULAR_TOPICS = [
  "JavaScript",
  "React.js",
  "Python",
  "World History",
  "General Science",
  "Data Structures",
  "Machine Learning",
  "General Knowledge",
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic to continue.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/quiz/generate", {
        topic: topic.trim(),
        difficulty,
        numQuestions,
      });
      navigate("/quiz", {
        state: {
          topic: res.data.topic,
          difficulty: res.data.difficulty,
          numQuestions: res.data.numQuestions,
          questions: res.data.questions,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Hi {user?.name?.split(" ")[0]}, ready to test yourself?
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Pick a topic, difficulty, and number of questions — our AI will build a fresh quiz for you.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="card space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Topic</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Photosynthesis, Ancient Rome, Node.js..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_TOPICS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTopic(t)}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["easy", "medium", "hard"].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition ${
                    difficulty === level
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-blue-200 bg-white text-slate-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Number of Questions: <span className="text-blue-600 dark:text-blue-400">{numQuestions}</span>
            </label>
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Generating your quiz..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  );
}
