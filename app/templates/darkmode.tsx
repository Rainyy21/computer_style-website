"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StarryBackground from "./StarryBackground";
import CloudBackground from "./CloudBackground";
import useWeather, { type WeatherCondition } from "./ts/useWeather";
const darkModeIcon = "/srcAndImg/dark_mode_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40(1).svg";
const lightModeIcon = "/srcAndImg/light_mode_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";

const WEATHER_LABELS: Record<WeatherCondition, string> = {
  clear: "☀️ Clear",
  cloudy: "⛅ Cloudy",
  overcast: "☁️ Overcast",
  fog: "🌫️ Fog",
  drizzle: "🌦️ Drizzle",
  rain: "🌧️ Rain",
  snow: "❄️ Snow",
  thunder: "⛈️ Thunderstorm",
};

interface DarkmodeProps {
  children?: React.ReactNode;
}

export default function Darkmode({ children }: DarkmodeProps) {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);
  const weather = useWeather();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [mounted, theme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <div className="min-h-screen">
      {theme === "dark" ? <StarryBackground /> : <CloudBackground weather={weather} />}
      {theme === "light" && weather && (
        <div className="fixed top-3 left-3 sm:top-5 sm:left-5 z-50 rounded-full bg-white/40 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm text-gray-700 shadow-sm">
          {WEATHER_LABELS[weather.condition]}
          {weather.temperature !== undefined && ` · ${weather.temperature}°C`}
          {weather.city && ` · ${weather.city}`}
        </div>
      )}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 transition-opacity hover:opacity-80"
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          <Image
            src={theme === "light" ? lightModeIcon : darkModeIcon}
            alt={theme === "light" ? "Light Mode Icon" : "Dark Mode Icon"}
            width={40}
            height={40}
            className={`sm:w-[60px] sm:h-[60px] ${theme === "light" ? "drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-transform hover:scale-105" : "transition-transform hover:scale-105"}`}
          />
        </button>
      </div>
      {children}
    </div>
  );
}
