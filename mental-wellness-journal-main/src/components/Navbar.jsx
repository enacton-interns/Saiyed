import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95vw] max-w-4xl mx-auto flex justify-between items-center px-8 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-glass z-40 border border-white/30 dark:border-gray-700/40">
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-tight text-primary-dark dark:text-primary-light flex items-center gap-2"
      >
        <span className="text-3xl">🧘</span> <span>Mental Journal</span>
      </Link>
      {/* Desktop nav */}
      <div className="hidden md:flex gap-6 text-lg font-medium">
        <Link
          to="/journal"
          className="hover:text-accent-dark transition-colors"
        >
          Journal
        </Link>
        <Link to="/mood" className="hover:text-accent-dark transition-colors">
          Mood
        </Link>
      </div>
      {/* Mobile hamburger */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-soft border border-white/30 dark:border-gray-700/40 focus:outline-none focus:ring-2 focus:ring-accent-dark"
          aria-label="Open navigation menu"
        >
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-primary-dark dark:text-primary-light"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-glass border border-white/30 dark:border-gray-700/40 py-2 flex flex-col z-50 animate-fade-in">
            <Link
              to="/journal"
              className="px-6 py-3 text-lg font-medium text-primary-dark dark:text-primary-light hover:bg-accent-dark/10 rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Journal
            </Link>
            <Link
              to="/mood"
              className="px-6 py-3 text-lg font-medium text-primary-dark dark:text-primary-light hover:bg-accent-dark/10 rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Mood
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
