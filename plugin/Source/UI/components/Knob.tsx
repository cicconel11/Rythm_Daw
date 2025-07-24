import React, { useState } from "react";

interface KnobProps {
  label: string;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
}

export const Knob: React.FC<KnobProps> = ({
  label,
  min = 0,
  max = 100,
  value = 50,
  onChange,
  size = 60,
}) => {
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);

  const angle = ((startValue - min) / (max - min)) * 270 - 135;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaY = startY - e.clientY;
      const deltaValue = (deltaY / 100) * (max - min);
      const newValue = Math.min(max, Math.max(min, startValue + deltaValue));
      if (onChange) onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      className="flex flex-col items-center space-y-2"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="relative bg-card rounded-full shadow-inner-md flex items-center justify-center cursor-pointer"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute w-2 h-6 bg-brand rounded-b-full top-0 origin-bottom"
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="absolute w-6 h-6 bg-panel rounded-full shadow-outer-md" />
      </div>
      <div className="text-text_primary text-sm font-medium text-center w-full truncate">
        {label}
      </div>
      <div className="absolute -top-2 bg-panel text-text_secondary text-xs px-2 py-0.5 rounded-md shadow-outer-md">
        {Math.round(value)}
      </div>
    </div>
  );
};
