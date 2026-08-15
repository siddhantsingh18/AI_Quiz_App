import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const attempt = state?.attempt;

  if (!attempt) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const { score, totalQuestions, percentage, topic, difficulty, timeTakenSeconds, answers } = attempt;

  const scoreColor =
    percentage >= 80 ? "text-green-600 dark:text-green-400" : percentage >= 50 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="card mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Quiz Complete</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
          {topic} <span className="capitalize text-slate-400">· {difficulty}</span>
        </h1>

        <div className={`my-6 text-6xl font-extrabold ${scoreColor}`}>{percentage}%</div>

        <p className="text-slate-600 dark:text-slate-300">
          You scored <span className="font-semibold">{score}</span> out of{" "}
          <span className="font-semibold">{totalQuestions}</span>
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Time taken: {Math.floor(timeTakenSeconds / 60)}m {timeTakenSeconds % 60}s
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="btn-primary">
            Take Another Quiz
          </Link>
          <Link to="/history" className="btn-secondary">
            View History
          </Link>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-100">Detailed Report</h2>
      <div className="space-y-4">
        {answers.map((a, idx) => (
          <div key={idx} className="card">
            <div className="mb-3 flex items-start justify-between gap-4">
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                {idx + 1}. {a.question}
              </p>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  a.isCorrect
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {a.isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-slate-600 dark:text-slate-300">
                Your answer:{" "}
                <span className={a.isCorrect ? "font-semibold text-green-600 dark:text-green-400" : "font-semibold text-red-600 dark:text-red-400"}>
                  {a.userAnswer || "Not answered"}
                </span>
              </p>
              {!a.isCorrect && (
                <p className="text-slate-600 dark:text-slate-300">
                  Correct answer: <span className="font-semibold text-green-600 dark:text-green-400">{a.correctAnswer}</span>
                </p>
              )}
              {a.explanation && (
                <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  💡 {a.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
