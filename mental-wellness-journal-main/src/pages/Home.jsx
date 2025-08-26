import { Link } from "react-router-dom";
import MoodChart from "../components/MoodChart";
import QuoteCard from "../components/QuoteCard";

export default function Home() {
  return (
    <div className="min-h-[90vh] w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4 pt-32 relative animate-fade-in overflow-hidden">
      {/* Decorative background gradient blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary-light via-accent-light to-accent-dark opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-dark via-primary-dark to-primary-light opacity-20 rounded-full blur-2xl z-0" />

      {/* Left: Hero Section */}
      <div className="flex-1 z-10 flex flex-col justify-center items-start max-w-xl w-full mb-10 md:mb-0">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary-dark dark:text-primary-light tracking-tight drop-shadow-sm">
          Welcome to Your{" "}
          <span className="text-accent-dark">Mental Wellness Journal</span> 🧘
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
          Track your mood, reflect on your thoughts, and get inspired every day.
          Your journey to a calmer, happier mind starts here.
        </p>
        <div className="flex gap-4 flex-wrap">
        <Link
        to="/journal"
            className="inline-block px-8 py-3 bg-primary-dark text-white rounded-full font-semibold shadow-soft hover:bg-accent-dark transition text-lg"
          >
            Start Journaling
          </Link>
          <Link
            to="/mood"
            className="inline-block px-8 py-3 bg-accent-dark text-white rounded-full font-semibold shadow-soft hover:bg-primary-dark transition text-lg"
          >
            Track Mood
          </Link>
        </div>
        <div className="mt-10 flex flex-col gap-2 text-lg text-gray-500 dark:text-gray-400">
          <span>✨ Private & Secure</span>
          <span>📱 Works on all devices</span>
          <span>🌙 Light & Dark Mode</span>
        </div>
      </div>

      {/* Right: QuoteCard */}
      <div className="flex-1 z-10 w-full max-w-xl">
        <QuoteCard />
      </div>
    </div>
  );
}
