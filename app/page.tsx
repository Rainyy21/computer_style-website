"use client";

import { useState } from "react";
import Window from "./templates/window";
import WindowPopUp from "./templates/windowPopUp";
import Project from "./templates/project";
import Image from "next/image";

const icon = "/srcAndImg/info_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
const link = "/srcAndImg/link_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
const project = "/srcAndImg/assignment_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
const home = "/srcAndImg/home_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";

type View = "profilo" | "link" | "project";

export default function Home() {
  const [openPopups, setOpenPopups] = useState<View[]>([]);

  const togglePopup = (view: View) => {
    setOpenPopups((prev) => {
      if (prev.includes(view)) {
        // Bring to front by moving to end of array
        return [...prev.filter((v) => v !== view), view];
      }
      return [...prev, view];
    });
  };

  const closePopup = (view: View) => {
    setOpenPopups(openPopups.filter((v) => v !== view));
  };

  const getTitle = (view: View) => {
    switch (view) {
      case "profilo":
        return "Profilo";
      case "link":
        return "Links";
      case "project":
        return "Projects";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      {/* Home Window - Always Visible */}
      <Window title="Home" variant="default">
        <div className="p-6">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-gray-600">Hi! I'm Simon</h1>
            <p>Student and aspiring developer</p>
            <div className="flex gap-6 justify-center">
              <button onClick={() => togglePopup("profilo")} className="base-button btn-primary">
                <Image src={icon} alt={"personal info"} width={40} height={40}></Image>
                <span>Profile</span>
              </button>
              <button onClick={() => togglePopup("link")} className="base-button btn-primary">
                <Image src={link} alt={"personal info"} width={40} height={40}></Image>
                <span>Links</span>
              </button>
              <button onClick={() => togglePopup("project")} className="base-button btn-primary">
                <Image src={project} alt={"personal info"} width={40} height={40}></Image>
                <span>Projects</span>
              </button>
            </div>
          </div>
        </div>
      </Window>

      {/* Render Open Popups */}
      {openPopups.map((view) => (
        <WindowPopUp
          key={view}
          title={getTitle(view)}
          variant={view}
          onClose={() => closePopup(view)}
          onFocus={() => togglePopup(view)}
        >
          <div className="p-6">
            {view === "project" && (
              <Project
                projectName="Profilo"
                skills={["React", "Next.js", "TypeScript", "Tailwind"]}
                description="A modern portfolio platform built with templates."
              >
                <p className="mt-2 text-sm text-gray-500 italic">
                  This is a live preview of the project template.
                </p>
              </Project>
            )}

            {/* the close button(might need to remove it )*/}
            <div className="mt-8 flex justify-center">
              <button onClick={() => closePopup(view)} className="base-button btn-gray">
                <Image src={home} alt="home" width={40} height={40} />
                <span>Close Popup</span>
              </button>
            </div>
          </div>
        </WindowPopUp>
      ))}
    </main>
  );
}
