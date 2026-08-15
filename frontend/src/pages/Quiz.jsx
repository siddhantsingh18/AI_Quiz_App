import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Quiz() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const questions = state?.questions;
  const topic = state?.topic;
  const difficulty = state?.difficulty;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!questions || !questions.length) {
      navigate("/dashboard", { replace: true });
    }
  }, [questions, navigate]);

  if (!questions || !questions.length) return null;

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelect = (option) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const goNext = () => {
    if (!isLast) setCurrentIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
    const answers = questions.map((q, idx) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      userAnswer: selectedAnswers[idx] ?? null,
    }));

    try {
      const res = await api.post("/quiz/submit", {
        topic,
        difficulty,
        numQuestions: questions.length,
        timeTakenSeconds,
        answers,
      });
      navigate("/result", { state: { attempt: res.data.attempt } });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{topic}</h1>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400">{difficulty} difficulty</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-slate-800 dark:text-blue-300">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="card">
        <h2 className="mb-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-200"
                    : "border-blue-100 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 text-slate-400 dark:border-slate-600"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={goPrev} disabled={currentIndex === 0} className="btn-secondary">
          Previous
        </button>

        <span className="text-sm text-slate-400">{answeredCount} / {questions.length} answered</span>

        {isLast ? (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button onClick={goNext} className="btn-primary">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
