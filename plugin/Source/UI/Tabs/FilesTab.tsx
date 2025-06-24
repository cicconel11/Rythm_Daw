import React from 'react';
import { useStore } from '@store';
import { Button } from '../components/Button';

const FilesTab: React.FC = () => {
  const { uploads } = useStore();

  return (
    <div className="flex h-full bg-background rounded-br-xl overflow-hidden relative shadow-inner-md">
      {/* Split Layout */}
      <div className="flex-1 border-r border-gray-700 p-4 overflow-y-auto">
        <h3 className="text-lg font-medium mb-4 text-text_primary">Upload Queue</h3>
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div key={upload.id} className="bg-card rounded-lg p-3 shadow-inner-md border border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-text_primary truncate flex-1">{upload.name}</span>
                <span className="text-xs text-text_secondary">{upload.status === 'uploading' ? `${upload.progress}%` : 'Done'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-700 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-lg font-medium mb-4 text-text_primary">Received Files</h3>
        <div className="space-y-3">
          {[
            { id: 1, name: 'Kick_Stem.wav', size: '12.5 MB' },
            { id: 2, name: 'Bass_Stem.wav', size: '14.2 MB' },
            { id: 3, name: 'Vocal_Stem.wav', size: '18.7 MB' },
          ].map((file) => (
            <div key={file.id} className="bg-card rounded-lg p-3 shadow-inner-md border border-gray-700 flex justify-between items-center">
              <div className="flex-1 truncate">
                <span className="text-sm text-text_primary truncate block">{file.name}</span>
                <span className="text-xs text-text_secondary">{file.size}</span>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <Button variant="primary">Import</Button>
                <Button variant="secondary">Save</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilesTab;
