"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StarryBackground from "./StarryBackground";
import darkModeIcon from "./srcAndImg/dark_mode_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40(1).svg";
import lightModeIcon from "./srcAndImg/light_mode_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";

interface DarkmodeProps {
  children?: React.ReactNode;
}

export default function Darkmode({ children }: DarkmodeProps) {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

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
      {theme === "dark" && <StarryBackground />}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 transition-opacity hover:opacity-80"
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          <Image
            src={theme === "light" ? lightModeIcon : darkModeIcon}
            alt={theme === "light" ? "Light Mode Icon" : "Dark Mode Icon"}
            width={40}
            height={40}
          />
        </button>
      </div>
      {children}
    </div>
  );
}
