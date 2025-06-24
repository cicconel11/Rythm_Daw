import React from 'react';

interface LedProps {
  on: boolean;
  colorOn?: string;
  colorOff?: string;
  size?: number;
  className?: string;
}

export const Led: React.FC<LedProps> = ({ on, colorOn = '#ff4d4d', colorOff = '#4d0000', size = 10, className = '' }) => {
  return (
    <div
      className={`rounded-full ${on ? 'shadow-[0_0_5px_#ff4d4d,0_0_10px_#ff4d4d]' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: on ? colorOn : colorOff,
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    />
  );
};
