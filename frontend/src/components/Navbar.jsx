import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-blue-100 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-blue-700 dark:text-blue-400">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">Q</span>
          AI Quiz App
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link
                to="/dashboard"
                className="hidden text-sm font-medium text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 sm:block"
              >
                Dashboard
              </Link>
              <Link
                to="/history"
                className="hidden text-sm font-medium text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400 sm:block"
              >
                History
              </Link>
            </>
          )}
          <ThemeToggle />
          {user ? (
            <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-sm">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary !px-3 !py-1.5 text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
