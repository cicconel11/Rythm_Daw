import React, { useCallback, useRef, useState } from 'react';

interface Props {
  value: number; // 0-1
  onChange: (v: number) => void;
  label?: string;
}

const Knob: React.FC<Props> = ({ value, onChange, label }) => {
  const [dragging, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const start = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDrag(true);
    const y0 = e.clientY;
    const v0 = value;
    const move = (ev: MouseEvent) => {
      const dy = y0 - ev.clientY;
      onChange(Math.min(1, Math.max(0, v0 + dy / 300)));
    };
    const up = () => {
      setDrag(false);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [value, onChange]);

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div
        ref={ref}
        onMouseDown={start}
        style={{ transform: `rotate(${value * 270 - 135}deg)` }}
        className={`w-16 h-16 rounded-full cursor-ns-resize
          bg-gradient-to-b from-[#3A3A3D] to-panel shadow-outer-md
          ${dragging ? 'scale-105' : ''} transition-transform`}
      />
      {label && <span className="text-xs text-text_muted">{label}</span>}
    </div>
  );
};

export default Knob;
