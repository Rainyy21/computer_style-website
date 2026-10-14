import React from "react";
import Image from "next/image";

interface ExperienceEntry {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
}

interface SkillCategory {
  name: string;
  items: string[];
}

interface ProfileProps {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  education?: string;
  experience?: ExperienceEntry[];
  skillCategories?: SkillCategory[];
  children?: React.ReactNode;
}

export default function Profile({
  name,
  title,
  bio,
  skills,
  avatarUrl,
  education,
  experience,
  skillCategories,
  children,
}: ProfileProps) {
  return (
    <div className="profileContainer">
      <div className="profileHeader">
        <div className="profileAvatarContainer">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={80}
              height={80}
              className="profileAvatarImage"
            />
          ) : (
            <div className="profileAvatarPlaceholder">
              <Image
                src="/srcAndImg/info_40dp_E3E3E3_FILL1_wght400_GRAD0_opsz40.svg"
                alt="Profile Avatar"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>
        <div className="profileHeaderDetails">
          <div className="profileName">{name}</div>
          <div className="profileTitleText">{title}</div>
        </div>
      </div>

      <div className="profileBio">{bio}</div>

      {education && (
        <div className="profileEducation">
          <div className="profileSectionTitle">Education</div>
          <p className="text-sm">{education}</p>
        </div>
      )}

      {/* Skills Section — categorized if available, otherwise flat list */}
      <div>
        <div className="profileSectionTitle">Skills</div>
        {skillCategories && skillCategories.length > 0 ? (
          <div className="profileSkillCategories">
            {skillCategories.map((category, index) => (
              <div key={index} className="profileSkillCategory">
                <div className="profileSkillCategoryName">{category.name}</div>
                <div className="profileSkills">
                  {category.items.map((item, i) => (
                    <span key={i} className="profileSkill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="profileSkills">
            {skills.map((skill, index) => (
              <span key={index} className="profileSkill">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div>
          <div className="profileSectionTitle">Experience</div>
          <div className="profileExperienceList">
            {experience.map((exp) => (
              <div key={exp.id} className="profileExperienceItem">
                <div className="profileExperienceRole">{exp.role}</div>
                <div className="profileExperienceCompany">{exp.company}</div>
                <div className="profileExperienceDuration">{exp.duration}</div>
                <div className="profileExperienceDescription">{exp.description}</div>
                <div className="profileSkills">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="profileSkill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {children && <div className="profileChildren mt-4">{children}</div>}
    </div>
  );
}
