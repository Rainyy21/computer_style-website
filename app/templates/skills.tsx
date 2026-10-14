import React from "react";

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsProps {
  categories: SkillCategory[];
}

export default function Skills({ categories }: SkillsProps) {
  return (
    <div className="skillsContainer">
      {categories.map((category, index) => (
        <div key={index} className="skillsCategory">
          <div className="skillsCategoryTitle">{category.name}</div>
          <div className="skillsCategoryItems">
            {category.items.map((item, i) => (
              <span key={i} className="skillsCategoryItem">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
