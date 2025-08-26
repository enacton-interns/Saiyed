import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Mood from "./pages/Mood";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <Navbar />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/mood" element={<Mood />} />
      </Routes>
    </div>
  );
}

export default App;
