"use client";

import { useState } from "react";
import Window from "./templates/window";
import WindowPopUp from "./templates/windowPopUp";
import Project from "./templates/project";
import LinkItem from "./templates/link";
import Profile from "./templates/profile";
import Image from "next/image";

import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import linksData from "@/data/links.json";
import experienceData from "@/data/experience.json";
import skillsData from "@/data/skills.json";

const icon = "/srcAndImg/info_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
const link = "/srcAndImg/link_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";
const project = "/srcAndImg/assignment_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg";

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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 relative">
      {/* Home Window - Always Visible */}
      <Window title="Home" variant="default">
        <div className="p-3 sm:p-6">
          <div className="flex flex-col items-center gap-4 sm:gap-8">
            <h1 className="text-gray-600 text-2xl sm:text-3xl md:text-5xl text-center">Hi! I'm {profileData.name}</h1>
            <p className="text-base sm:text-xl text-center">{profileData.title}</p>
            <div className="flex flex-wrap gap-3 sm:gap-6 justify-center">
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
            {view === "profilo" && (
              <Profile
                name={profileData.name}
                title={profileData.title}
                bio={profileData.bio}
                education={profileData.education}
                skills={profileData.skills}
                avatarUrl={profileData.avatarUrl}
                experience={experienceData}
                skillCategories={skillsData.categories}
              />
            )}

            {view === "project" && (
              <div className="flex flex-col gap-4">
                {(projectsData as { id: string; projectName: string; skills: string[]; description: string; link?: string }[]).map((proj) => (
                  <Project
                    key={proj.id}
                    projectName={proj.projectName}
                    skills={proj.skills}
                    description={proj.description}
                    link={proj.link}
                  />
                ))}
              </div>
            )}

            {view === "link" && (
              <div className="linkContainer">
                {linksData.map((item) => (
                  <LinkItem
                    key={item.id}
                    label={item.label}
                    url={item.url}
                    description={item.description}
                    icon={item.icon}
                  />
                ))}
              </div>
            )}

          </div>
        </WindowPopUp>
      ))}
    </main>
  );
}
