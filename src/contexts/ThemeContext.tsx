import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  clearThemePreference: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  clearThemePreference: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to dark — matches the brand's dark design direction
  const [theme, setTheme] = useState<Theme>("dark");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      // Default to dark; only fall back to light if system explicitly requests it
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "dark"); // brand default is always dark
    }
  }, []);

  // Apply / remove the `dark` class on <html>
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0B0F1A" : "#FAF5EB");
    }
  }, [theme, isClient]);

  const toggleTheme = () => {
    if (typeof window === "undefined") return;
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const clearThemePreference = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("theme");
    setTheme("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, clearThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
