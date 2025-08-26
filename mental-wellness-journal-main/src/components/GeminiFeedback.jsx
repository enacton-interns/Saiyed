// src/components/GeminiFeedback.js
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// It's recommended to store your API key in an environment variable for security
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiFeedback({ entry }) {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFeedback = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

     const prompt = `
  You are an AI journaling companion. Your personality is warm, empathetic, and insightful, like a close, supportive friend. Your name is 'Aura'.

  Your task is to read the user's journal entry and write a short, conversational, and caring response. Your main goal is to make the user feel heard and understood.

  Based on the tone and content of the entry, decide on the most appropriate response:

  1.  **If the entry is positive, happy, or grateful:** Share in their happiness. Validate their positive feelings and reflect their joy back to them. You could say something that helps them savor the moment.

  2.  **If the entry is negative, sad, stressed, or angry:** Focus on providing validation and gentle comfort. Let them know that their feelings are valid and it's okay to feel that way. Avoid giving unsolicited advice or forcing positivity. Just be a safe space for them to vent.

  3.  **If the entry is neutral, reflective, or observational:** Offer a thoughtful observation or ask a gentle, open-ended question that encourages deeper self-reflection. Show that you are engaged with their thoughts.

  **Important Rules for Your Response:**
  - **Be conversational:** Write as if you were sending a thoughtful message to a friend. Use "I" and "you".
  - **No rigid structure:** Do NOT use formal headings like "Validation" or "Positivity Tips." Let the response flow naturally as a single, cohesive message.
  - **Keep it concise:** Your response should be a few sentences long—warm and to the point.
  - **Empathy is key:** The user should feel your supportive presence, not like they are being analyzed.

  Here is the user's journal entry:
  "${entry.text}"
`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setFeedback(text);
    } catch (err) {
      console.error("Error generating feedback:", err);
      setError("Sorry, I couldn't get any feedback at the moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={getFeedback}
        disabled={isLoading}
        className="bg-accent-light text-primary-dark px-4 py-2 rounded-full font-semibold shadow-soft hover:bg-accent-dark/80 transition disabled:bg-gray-400"
      >
        {isLoading ? "Getting Feedback..." : "Get Insightful Feedback"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {feedback && (
        <div className="mt-4 p-4 bg-background-light dark:bg-background-dark rounded-xl shadow-inner whitespace-pre-wrap">
          <h4 className="font-bold text-lg mb-2 text-primary-dark dark:text-primary-light">Feedback from your companion:</h4>
          <p className="text-gray-800 dark:text-gray-200">{feedback}</p>
        </div>
      )}
    </div>
  );
}
