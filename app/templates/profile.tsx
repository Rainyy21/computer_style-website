import React from "react";
import Image from "next/image";

interface ProfileProps {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  avatarUrl?: string;
  education?: string;
  children?: React.ReactNode;
}

export default function Profile({
  name,
  title,
  bio,
  skills,
  avatarUrl,
  education,
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

      <div>
        <div className="profileSectionTitle">Skills</div>
        <div className="profileSkills">
          {skills.map((skill, index) => (
            <span key={index} className="profileSkill">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {children && <div className="profileChildren mt-4">{children}</div>}
    </div>
  );
}
