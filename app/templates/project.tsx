import React from "react";

interface ProjectProps {
  projectName: string;
  skills: string[];
  description: string;
  link?: string;
  children?: React.ReactNode;
}

export default function Project({ projectName, skills, description, link, children }: ProjectProps) {
  return (
    <div className="projectContainer">
      <div className="projectTitle">{projectName}</div>
      <div className="skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill">{skill}</span>
        ))}
      </div>
      <div className="description">{description}</div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="projectLink">
          View project →
        </a>
      )}
      {children && <div className="projectChildren">{children}</div>}
    </div>
  );
}
