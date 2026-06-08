import React from "react";

type WindowVariant = "profilo" | "project" | "link" | "default";

interface WindowProps {
  title: string;
  variant?: WindowVariant;
  children?: React.ReactNode;
}

export default function Window({ title, variant = "default", children }: WindowProps) {
  return (
    <div className={`window window-${variant}`}>
      <div className="title">
        <h1>{title}</h1>
      </div>
      <div className="mainContent">
        {variant === "profilo" && (
          <div className="profilo-view">
            {/* Placeholder for Profilo content */}
            <p>Profile Content</p>
          </div>
        )}
        
        {variant === "project" && (
          <div className="project-view">
            {/* Placeholder for Project content */}
            <p>Project Details</p>
          </div>
        )}
        
        {variant === "link" && (
          <div className="flex justify-center p-4">
            <button className="base-button btn-primary">Click Here</button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
