import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moodToScore = {
  Happy: 3,
  Neutral: 2,
  Sad: 1,
  Angry: 1,
  Stressed: 1,
};

export default function MoodChart({ moodData }) {
  const data = moodData
    .map((entry) => ({
      date: entry.date,
      moodScore: moodToScore[entry.mood] || 2,
    }))
    .reverse();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 text-gray-900 dark:text-white animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-dark dark:text-primary-light drop-shadow-sm">
        📈 Mood Trends
      </h2>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-glass p-6 border border-white/20 dark:border-gray-700/30 transition-all duration-500">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#a5b4fc"
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[1, 2, 3]}
                stroke="currentColor"
                tick={{ fill: "currentColor" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "12px",
                  boxShadow: "0 4px 32px 0 rgba(80, 80, 180, 0.10)",
                  fontFamily: "Inter, Nunito, ui-sans-serif",
                  fontSize: "1rem",
                }}
                wrapperStyle={{
                  outline: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="moodScore"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{
                  r: 6,
                  fill: "#e879f9",
                  stroke: "#6366f1",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  fill: "#fff",
                  stroke: "#e879f9",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No mood data available yet.
          </p>
        )}
      </div>
    </div>
  );
}
