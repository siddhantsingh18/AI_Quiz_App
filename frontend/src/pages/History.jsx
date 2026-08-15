import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get("/history"),
          api.get("/history/stats/summary"),
        ]);
        setAttempts(historyRes.data.attempts);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const viewAttempt = async (id) => {
    try {
      const res = await api.get(`/history/${id}`);
      navigate("/result", { state: { attempt: res.data.attempt } });
    } catch (err) {
      alert("Failed to load quiz details.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">Your Quiz History</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Total Attempts", stats.totalAttempts],
            ["Average Score", `${stats.averagePercentage}%`],
            ["Best Score", `${stats.bestPercentage}%`],
            ["Questions Answered", stats.totalQuestionsAnswered],
          ].map(([label, value]) => (
            <div key={label} className="card text-center">
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="card text-center">
          <p className="mb-4 text-slate-500 dark:text-slate-400">You haven't taken any quizzes yet.</p>
          <Link to="/dashboard" className="btn-primary">
            Take Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a) => (
            <button
              key={a._id}
              onClick={() => viewAttempt(a._id)}
              className="card flex w-full items-center justify-between text-left transition hover:border-blue-300"
            >
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{a.topic}</p>
                <p className="text-xs capitalize text-slate-400">
                  {a.difficulty} · {a.totalQuestions} questions · {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  a.percentage >= 80
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : a.percentage >= 50
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {a.percentage}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
