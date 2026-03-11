import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_STORAGE_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  return { darkMode, toggleDarkMode };
};