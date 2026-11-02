import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative h-9 w-9 rounded-full flex items-center justify-center
        border border-cec-gray-bd
        bg-white dark:bg-cec-navy
        text-cec-charcoal dark:text-white
        hover:border-cec-navy dark:hover:border-white
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cec-navy
        ${className}
      `}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-cec-navy" />
      )}
    </button>
  );
};
