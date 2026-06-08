"use client";

import { useState } from "react";
import Window from "./templates/window";
import Project from "./templates/project";
import Image from "next/image";
import icon from "./templates/srcAndImg/info_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
import link from "./templates/srcAndImg/link_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
import project from "./templates/srcAndImg/assignment_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
import home from "./templates/srcAndImg/home_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";

type View = "default" | "profilo" | "link" | "project";

export default function Home() {
  const [view, setView] = useState<View>("default");

  const getTitle = () => {
    switch (view) {
      case "profilo":
        return "Profilo";
      case "link":
        return "Links";
      case "project":
        return "Projects";
      default:
        return "Home";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Window title={getTitle()} variant={view === "default" ? "default" : view}>
        <div className="p-6">
          {view === "default" && (
            <div className="flex flex-col items-center gap-8">
              <p className="text-gray-600">Select a category to explore:</p>
              <div className="flex gap-6 justify-center">
                <button
                  onClick={() => setView("profilo")}
                  className="base-button btn-primary"
                >
                  <Image src={icon} alt={"personal info"}></Image>
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setView("link")}
                  className="base-button btn-primary"
                >
                  <Image src={link} alt={"personal info"}></Image>
                  <span>Links</span>
                </button>
                <button
                  onClick={() => setView("project")}
                  className="base-button btn-primary"
                >
                  <Image src={project} alt={"personal info"}></Image>
                  <span>Projects</span>
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
                  <p className="mt-2 text-sm text-gray-500 italic">
                    This is a live preview of the project template.
                  </p>
                </Project>
              )}

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setView("default")}
                  className="base-button btn-gray"
                >
                  <Image src={home} alt="home" />
                  <span>Home</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Window>
    </main>
  );
}
