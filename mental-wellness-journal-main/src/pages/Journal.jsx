// The updated Journal component
import { useState, useEffect } from "react";
import GeminiFeedback from "../components/GeminiFeedback"; // Make sure the path is correct

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [tag, setTag] = useState("General");

  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!entry.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: entry,
      tag,
      date: new Date().toLocaleDateString(),
    };
    setEntries([newEntry, ...entries]);
    setEntry("");
    setTag("General");
  };

  const tags = ["General", "Grateful", "Stressed", "Happy", "Sad"];

  return (
    <div className="min-h-[90vh] w-full flex flex-col md:flex-row items-center justify-center gap-12 px-4 pt-32 relative animate-fade-in overflow-hidden">
      {/* Decorative background gradient blob */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary-light via-accent-light to-accent-dark opacity-30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-dark via-primary-dark to-primary-light opacity-20 rounded-full blur-2xl z-0" />

      {/* Left: Journal Entry Form */}
      <div className="flex-1 z-10 flex flex-col justify-center items-start max-w-xl w-full mb-10 md:mb-0">
        <h2 className="text-4xl font-bold mb-6 text-primary-dark dark:text-primary-light drop-shadow-sm">
          📝 Today's Journal
        </h2>
        <textarea
          className="w-full h-40 p-4 rounded-2xl border-none bg-background-light dark:bg-background-dark text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-soft focus:ring-2 focus:ring-primary-dark focus:outline-none transition mb-4"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts..."
        />
        <div className="flex gap-2 flex-wrap mb-4">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`px-4 py-2 rounded-full font-semibold transition shadow-soft border border-transparent focus:outline-none focus:ring-2 focus:ring-accent-dark text-sm
                ${
                  tag === t
                    ? "bg-accent-dark text-white scale-105 shadow-glass"
                    : "bg-white/70 dark:bg-gray-800/70 text-primary-dark dark:text-primary-light hover:bg-accent-dark/10"
                }
              `}
              aria-pressed={tag === t}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="bg-primary-dark text-white px-6 py-2 rounded-full font-semibold shadow-soft hover:bg-accent-dark transition"
        >
          Save Entry
        </button>
      </div>

      {/* Right: Previous Entries */}
      <div className="flex-1 z-10 w-full max-w-xl">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-glass p-8 border border-white/30 dark:border-gray-700/40">
          <h3 className="text-2xl font-bold mb-4 text-primary-dark dark:text-primary-light drop-shadow-sm">
            📔 Previous Entries
          </h3>
          {entries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No entries yet.</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-soft p-5 border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{item.date}</span>
                    <span className="italic text-accent-dark font-semibold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-lg text-gray-900 dark:text-white whitespace-pre-line">
                    {item.text}
                  </p>
                  <GeminiFeedback entry={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

