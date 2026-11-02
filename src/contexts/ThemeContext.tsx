import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  clearThemePreference: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  clearThemePreference: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default light — Figma design is light mode first
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      // Follow system preference if no saved choice
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply dark class to <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Update theme-color meta
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0F2440" : "#F8F8F8");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const clearThemePreference = () => {
    localStorage.removeItem("theme");
    setTheme("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, clearThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
