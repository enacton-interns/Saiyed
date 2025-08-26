import { useState, useEffect } from "react";
import MoodChart from "../components/MoodChart";

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😰", label: "Stressed" },
];

export default function Mood() {
  const today = new Date().toLocaleDateString();

  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [lastSelectedMood, setLastSelectedMood] = useState(null);

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleSelect = (mood) => {
    const newEntry = {
      date: today,
      mood,
      time: new Date().toLocaleTimeString(),
    };
    setMoodHistory([newEntry, ...moodHistory]);
    setLastSelectedMood(mood);
  };

  return (
    <div className="min-h-[90vh] w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4 pt-32 relative animate-fade-in overflow-hidden">
      {/* Decorative background gradient blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary-light via-accent-light to-accent-dark opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-dark via-primary-dark to-primary-light opacity-20 rounded-full blur-2xl z-0" />

      {/* Left: Mood Picker */}
      <div className="flex-1 z-10 flex flex-col justify-center items-start max-w-xl w-full mb-10 md:mb-0">
        <h2 className="text-4xl font-bold mb-6 text-primary-dark dark:text-primary-light drop-shadow-sm">
          📅 How are you feeling right now?
        </h2>
        <div className="flex justify-start gap-4 mb-8 flex-wrap">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => handleSelect(m.label)}
              className={`text-4xl transition-transform duration-200 hover:scale-125 focus:scale-125 rounded-full p-3 shadow-soft border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-accent-dark ${lastSelectedMood === m.label ? 'bg-accent-dark/20 dark:bg-accent-dark/30 border-accent-dark' : ''}`}
              aria-label={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        {lastSelectedMood && (
          <p className="text-green-600 dark:text-green-400 mb-4 text-lg font-semibold animate-fade-in">
            ✅ You just selected <span className="font-bold">{lastSelectedMood}</span>
          </p>
        )}
      </div>

      {/* Right: Mood History & Chart */}
      <div className="flex-1 z-10 w-full max-w-xl">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-glass p-8 border border-white/30 dark:border-gray-700/40 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-primary-dark dark:text-primary-light drop-shadow-sm">
            📊 Mood History
          </h3>
          {moodHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No mood data yet.</p>
          ) : (
            <ul className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
              {moodHistory.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-soft border border-white/20 dark:border-gray-700/30 text-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="flex items-center gap-2">
                    {moods.find((m) => m.label === entry.mood)?.emoji}
                    <span className="font-medium">{entry.mood}</span>
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date} {entry.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-glass border border-white/20 dark:border-gray-700/30">
          <MoodChart moodData={moodHistory} />
        </div>
      </div>
    </div>
  );
}
