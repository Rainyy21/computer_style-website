"use client";

import { useState } from "react";
import Window from "./templates/window";
import Project from "./templates/project";

type View = "default" | "profilo" | "link" | "project";

export default function Home() {
  const [view, setView] = useState<View>("default");

  const getTitle = () => {
    switch (view) {
      case "profilo": return "Profilo";
      case "link": return "Links";
      case "project": return "Projects";
      default: return "Home";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Window title={getTitle()} variant={view === "default" ? "default" : view}>
        <div className="p-6">
          {view === "default" && (
            <div className="flex flex-col items-center gap-8">
              <p className="text-gray-600">Select a category to explore:</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setView("profilo")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all font-medium"
                >
                  Profilo
                </button>
                <button 
                  onClick={() => setView("link")}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all font-medium"
                >
                  Link
                </button>
                <button 
                  onClick={() => setView("project")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all font-medium"
                >
                  Project
                </button>
              </div>
            </div>
          )}

          {view !== "default" && (
            <div className="mt-4">
              {view === "project" && (
                <Project 
                  projectName="Improve Profilo" 
                  skills={["React", "Next.js", "TypeScript", "Tailwind"]}
                  description="A modern portfolio platform built with templates."
                >
                  <p className="mt-2 text-sm text-gray-500 italic">This is a live preview of the project template.</p>
                </Project>
              )}
              
              <button 
                onClick={() => setView("default")}
                className="mt-8 text-blue-600 hover:underline flex items-center gap-2"
              >
                ← Back to Home
              </button>
            </div>
          )}
        </div>
      </Window>
    </main>
  );
}
