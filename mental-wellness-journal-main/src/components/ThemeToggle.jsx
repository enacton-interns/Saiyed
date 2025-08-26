import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="fixed z-50 bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-full shadow-glass border border-white/30 dark:border-gray-700/40 transition-colors duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-dark"
      aria-label="Toggle theme"
    >
      <span className="text-2xl transition-transform duration-300">
        {isDark ? "🌞" : "🌙"}
      </span>
    </button>
  );
}
