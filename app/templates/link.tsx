import React from "react";
import Image from "next/image";

interface LinkItemProps {
  label: string;
  url: string;
  description?: string;
  icon?: string;
}

export default function LinkItem({ label, url, description, icon }: LinkItemProps) {
  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  return (
    <a
      href={url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="linkCard"
    >
      {icon && (
        <div className="linkIcon">
          <Image src={icon} alt={label} width={32} height={32} />
        </div>
      )}
      <div className="linkContent">
        <span className="linkLabel">{label}</span>
        {description && <span className="linkDescription">{description}</span>}
      </div>
      <span className="linkArrow">→</span>
    </a>
  );
}
