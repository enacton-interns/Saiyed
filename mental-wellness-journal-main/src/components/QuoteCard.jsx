import { useEffect, useState } from "react";

export default function QuoteCard() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const requests = await Promise.all([
        fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "Re+6WnqFxs5wiMv24aQAgg==pTsIt8r5XfDTdmCe",
          },
        }),
        fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "Re+6WnqFxs5wiMv24aQAgg==pTsIt8r5XfDTdmCe",
          },
        }),
        fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "Re+6WnqFxs5wiMv24aQAgg==pTsIt8r5XfDTdmCe",
          },
        }),
      ]);

      const data = await Promise.all(requests.map((r) => r.json()));
      const quoteArray = data.map((d) => d[0]);
      setQuotes(quoteArray);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
      setQuotes([
        {
          quote: "Stay positive, and take it one step at a time.",
          author: "Unknown",
        },
        { quote: "You are stronger than you think.", author: "Unknown" },
        { quote: "Even slow progress is progress.", author: "Unknown" },
      ]);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-primary-dark dark:text-primary-light mb-8 drop-shadow-sm">
        🌿 Daily Inspiration
      </h2>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-glass p-8 border border-white/30 dark:border-gray-700/40 transition-all duration-500">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="h-6 bg-primary-light/40 rounded w-full"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((q, idx) => (
              <div
                key={idx}
                className="transition-opacity duration-500 opacity-100"
              >
                <p className="text-xl italic text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                  “{q.quote}”
                </p>
                <p className="text-base text-right text-primary-dark dark:text-primary-light font-semibold mt-1">
                  — {q.author}
                </p>
                {idx !== quotes.length - 1 && (
                  <hr className="my-4 border-primary-light/30 dark:border-primary-dark/30" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={fetchQuotes}
          className="px-6 py-2 bg-accent-dark text-white rounded-full font-medium shadow-soft hover:bg-primary-dark transition"
        >
          🔄 Refresh Quotes
        </button>
      </div>
    </div>
  );
}
