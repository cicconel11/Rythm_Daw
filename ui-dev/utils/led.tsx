import React from 'react';

export const Led: React.FC<{ on: boolean }> = ({ on }) => (
  <div
    className={`w-2 h-2 rounded-full transition-colors shadow-inner-md ${
      on ? 'bg-led_on' : 'bg-led_off'
    }`}
  />
);
