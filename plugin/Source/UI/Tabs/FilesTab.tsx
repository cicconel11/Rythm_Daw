import React from "react";
import { useStore } from "@store";
import { Button } from "../components/Button";
import { useTransfers } from '../../../../shared/hooks/useTransfers';
import { useFileUpload } from '../../../../shared/hooks/useFileUpload';
import { useTransferActions } from '../../../../shared/hooks/useTransferActions';
import { useState } from 'react';

const FilesTab: React.FC = () => {
  const { uploads } = useStore();
  const { data: transfers, isLoading, downloadUrl } = useTransfers();
  const upload = useFileUpload();
  const { accept, decline, download } = useTransferActions();
  const [file, setFile] = useState<File | null>(null);
  const [toUserId, setToUserId] = useState('');

  const handleUpload = () => {
    if (file && toUserId) {
      upload.mutate({ file, toUserId, fileName: file.name, mimeType: file.type, size: file.size });
    }
  };

  return (
    <div className="flex h-full bg-background rounded-br-xl overflow-hidden relative shadow-inner-md">
      {/* Split Layout */}
      <div className="flex-1 border-r border-gray-700 p-4 overflow-y-auto">
        <h3 className="text-lg font-medium mb-4 text-text_primary">
          Upload Queue
        </h3>
        <div className="space-y-3">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-card rounded-lg p-3 shadow-inner-md border border-gray-700"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-text_primary truncate flex-1">
                  {upload.name}
                </span>
                <span className="text-xs text-text_secondary">
                  {upload.status === "uploading"
                    ? `${upload.progress}%`
                    : "Done"}
                </span>
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
        <h3 className="text-lg font-medium mb-4 text-text_primary">
          Received Files
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, name: "Kick_Stem.wav", size: "12.5 MB" },
            { id: 2, name: "Bass_Stem.wav", size: "14.2 MB" },
            { id: 3, name: "Vocal_Stem.wav", size: "18.7 MB" },
          ].map((file) => (
            <div
              key={file.id}
              className="bg-card rounded-lg p-3 shadow-inner-md border border-gray-700 flex justify-between items-center"
            >
              <div className="flex-1 truncate">
                <span className="text-sm text-text_primary truncate block">
                  {file.name}
                </span>
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
