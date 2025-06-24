import React from 'react';
import { useStore } from '@store';
import { Led } from '../components/Led';

const AccountTab: React.FC = () => {
  const { plugins } = useStore();

  return (
    <div className="flex flex-col h-full bg-background rounded-br-xl overflow-hidden relative shadow-inner-md p-4">
      {/* Account Info */}
      <div className="mb-6 bg-card rounded-lg p-4 shadow-inner-md border border-gray-700">
        <div className="flex items-center space-x-4 mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-text_primary font-bold text-lg">
            U
          </div>
          <div>
            <h3 className="text-lg font-medium text-text_primary">User Name</h3>
            <div className="flex items-center space-x-1 mt-1">
              <Led on={true} colorOn="#ffa500" colorOff="#4d4d00" size={6} />
              <span className="text-xs text-text_secondary">Free Beta</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plugins List */}
      <h3 className="text-lg font-medium mb-4 text-text_primary">My Plug-ins</h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="bg-card rounded-lg p-3 shadow-inner-md border border-gray-700 flex justify-between items-center">
            <span className="text-sm text-text_primary truncate flex-1">{plugin.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${plugin.compatible ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {plugin.compatible ? '✓ Compatible' : '✖ Version Mismatch'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-gray-700 flex justify-end">
        <div className="relative group">
          <button
            className="px-4 py-2 bg-panel rounded-md text-text_secondary opacity-50 cursor-not-allowed shadow-outer-md"
            disabled
          >
            Rescan
          </button>
          <div className="absolute right-0 bottom-full mb-1 w-24 bg-black bg-opacity-80 text-text_primary text-xs text-center px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 border border-gray-700 shadow-outer-md">
            Demo Only
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
