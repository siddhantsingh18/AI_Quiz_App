import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-800 dark:text-blue-300">
        AI-Powered Adaptive Quiz Generation
      </span>
      <h1 className="text-4xl font-extrabold leading-tight text-slate-800 dark:text-slate-100 sm:text-5xl">
        Test your knowledge on <span className="text-blue-600 dark:text-blue-400">any topic</span>, instantly.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
        Enter any subject, pick your difficulty, and let AI generate a custom quiz with instant scoring,
        detailed explanations, and a full performance history.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link to={user ? "/dashboard" : "/register"} className="btn-primary">
          {user ? "Go to Dashboard" : "Get Started Free"}
        </Link>
        {!user && (
          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          ["📝", "Custom Topics", "Enter any topic or subject to generate a customized quiz."],
          ["🎚️", "Difficulty Levels", "Choose Easy, Medium, or Hard to match your skill level."],
          ["📊", "Performance History", "Track your scores over time with a personal dashboard."],
        ].map(([icon, title, desc]) => (
          <div key={title} className="card text-left">
            <div className="mb-2 text-2xl">{icon}</div>
            <h3 className="mb-1 font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
