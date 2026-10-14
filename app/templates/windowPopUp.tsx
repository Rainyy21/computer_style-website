import React from "react";
import { useDraggable } from "./ts/useDraggable";

type WindowVariant = "profilo" | "project" | "link" | "experience" | "skills" | "default";

interface WindowProps {
  title: string;
  variant?: WindowVariant;
  children?: React.ReactNode;
  onClose?: () => void;
  onFocus?: () => void;
  style?: React.CSSProperties;
}

export default function WindowPopUp({
  title,
  variant = "default",
  children,
  onClose,
  onFocus,
  style,
}: WindowProps) {
  const { pos, dragRef, onMouseDown, onTouchStart } = useDraggable({ x: 200, y: 150 });

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    onMouseDown(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    onFocus?.();
    onTouchStart(e);
  };

  return (
    <div
      className={`window window-popup window-${variant}`}
      ref={dragRef}
      onMouseDown={onFocus}
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 100,
        ...style,
      }}
    >
      <div
        className="title flex items-center justify-between"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: "grab" }}
      >
        <h1 className="select-none">{title}</h1>
        <button
          onClick={onClose}
          aria-label="Close"
          className="hover:text-red-500 transition-colors p-1 text-xl font-bold cursor-pointer"
        >
          ✖
        </button>
      </div>
      <div className="mainContent">
        {children}
      </div>
    </div>
  );
}
