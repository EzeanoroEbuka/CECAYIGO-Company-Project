import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Floodlight toggle.
 * Light mode  = floodlight ON  (lens glows, beam fans out, a short warm-up flicker when switched on)
 * Dark mode   = floodlight OFF (lens goes dull, beam fades away)
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [touched, setTouched] = useState(false); // only play the flicker after a real click, not on page load
  const isOn = theme === "light";

  const handleClick = () => {
    setTouched(true);
    toggleTheme();
  };

  const flicker = touched && isOn && !reduceMotion;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={isOn ? "Floodlight on: switch to dark mode" : "Floodlight off: switch to light mode"}
      title={isOn ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isOn}
      whileTap={{ scale: 0.92 }}
      initial={false}
      animate={{
        boxShadow: isOn
          ? "0 0 16px 3px rgba(255, 214, 77, 0.55)"
          : "0 0 0 0 rgba(255, 214, 77, 0)",
      }}
      transition={{ duration: 0.35 }}
      className={`relative h-8 w-8 rounded-full flex items-center justify-center overflow-hidden bg-slate-900 border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${className}`}
    >
      {/* one-off flash when the light is switched on */}
      {flicker && (
        <motion.span
          key={`flash-${theme}`}
          aria-hidden
          className="absolute inset-0 rounded-full bg-amber-200"
          initial={{ opacity: 0.7, scale: 0.4 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      <svg viewBox="0 0 40 40" className="relative h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="fl-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFE27A" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFE27A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* beam */}
        <motion.path
          d="M21 15 L39 4 L39 34 L21 25 Z"
          fill="url(#fl-beam)"
          initial={false}
          animate={{ opacity: isOn ? (flicker ? [0, 1, 0.3, 1, 0.65, 1] : 1) : 0 }}
          transition={flicker ? { duration: 0.7, times: [0, 0.15, 0.3, 0.5, 0.7, 1] } : { duration: 0.3 }}
        />

        {/* stand + base */}
        <path d="M12 26 L12 33" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <rect x="7" y="33" width="10" height="3" rx="1.5" fill="#64748B" />
        {/* yoke */}
        <path d="M6 20 Q12 31 18 20" stroke="#64748B" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* lamp head */}
        <rect x="5" y="12" width="14" height="14" rx="3" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
        <path d="M9 14 V24 M12 14 V24 M15 14 V24" stroke="#475569" strokeWidth="1" strokeLinecap="round" />

        {/* lens */}
        <motion.rect
          x="19"
          y="14"
          width="4"
          height="12"
          rx="1.6"
          initial={false}
          animate={{ fill: isOn ? "#FFD84D" : "#4B5563" }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.button>
  );
};