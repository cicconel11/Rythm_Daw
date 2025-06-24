import React, { useState } from 'react';
import { Led } from './components/Led';
import { useStore } from '@store';

const TopBar: React.FC = () => {
  const { recording, toggleRecording } = useStore();
  const [bpm, setBpm] = useState(120);
  const [project, setProject] = useState('Lo-Fi Groove v2');
  const projects = ['Lo-Fi Groove v2', 'House Jam', 'Client Mix'];

  return (
    <header className="bg-panel h-16 flex items-center justify-between px-6 rounded-t-xl shadow-outer-md text-text_primary">
      {/* Left: RHYTHM Wordmark */}
      <div className="flex items-center">
        <svg width="120" height="40" viewBox="0 0 120 40" className="text-brand">
          <text x="10" y="30" fontSize="24" fontWeight="bold" fill="currentColor">RHYTHM</text>
        </svg>
      </div>

      {/* Center: Project Dropdown */}
      <div className="flex items-center justify-center">
        <select 
          value={project} 
          onChange={(e) => setProject(e.target.value)}
          className="bg-card text-text_primary rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {projects.map((proj) => (
            <option key={proj} value={proj}>{proj}</option>
          ))}
        </select>
      </div>

      {/* Right: BPM Field and REC LED */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">BPM:</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Math.max(40, Math.min(200, parseInt(e.target.value) || 120)))}
            className="w-16 bg-card text-text_primary rounded-md px-2 py-1 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleRecording}>
          <Led on={recording} size={8} />
          <span className="text-sm font-medium">REC</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
