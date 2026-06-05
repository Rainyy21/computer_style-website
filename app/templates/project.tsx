import React from "react";

interface ProjectProps {
  projectName: string;
  skills: string[];
  description: string;
  children?: React.ReactNode;
}

export default function Project({ projectName, skills, description, children }: ProjectProps) {
  return (
    <div className="projectContainer">
      <div className="projectTitle">{projectName}</div>
      <div className="skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill">{skill}</span>
        ))}
      </div>
      <div className="description">{description}</div>
      {children && <div className="projectChildren">{children}</div>}
    </div>
  );
}
