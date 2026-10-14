import React from "react";

interface ExperienceItemProps {
  role: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

export default function ExperienceItem({
  role,
  company,
  duration,
  description,
  skills,
}: ExperienceItemProps) {
  return (
    <div className="experienceContainer">
      <div className="experienceHeader">
        <div className="experienceRole">{role}</div>
        <div className="experienceCompany">{company}</div>
        <div className="experienceDuration">{duration}</div>
      </div>
      <div className="experienceDescription">{description}</div>
      <div className="experienceSkills">
        {skills.map((skill, index) => (
          <span key={index} className="experienceSkill">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
