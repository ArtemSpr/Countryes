// ThemeSwitcher.jsx
import React, { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  // Зчитуємо вибір теми з localStorage при завантаженні
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.body.classList.add("darkTheme");
    } else {
      setIsDark(false);
      document.body.classList.remove("darkTheme");
    }
  }, []);

  // Функція для зміни теми
  const handleToggle = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("darkTheme", !isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  return (
    <div className="theme-switcher">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={isDark}
        onChange={handleToggle}
        className="theme-toggle-checkbox"
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <span className={`theme-icon sun ${isDark ? "hidden" : ""}`}>☀️</span>
        <span className={`theme-icon moon ${isDark ? "" : "hidden"}`}>🌙</span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
