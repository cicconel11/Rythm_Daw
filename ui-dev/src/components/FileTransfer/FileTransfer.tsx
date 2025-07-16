import React, { useState, useCallback, useRef } from 'react';
import { useFileTransfer } from '../../hooks/useFileTransfer';
import { Button, Progress, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface FileTransferProps {
  userId: string;
  recipientId: string;
}

const FileTransfer: React.FC<FileTransferProps> = ({ userId, recipientId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isConnected,
    isTransferring,
    transferProgress,
    error,
    sendFileP2P,
  } = useFileTransfer(userId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendFile = useCallback(async () => {
    if (!selectedFile) return;

    try {
      await sendFileP2P(selectedFile, recipientId, {
        onProgress: (progress) => {
          console.log(`Transfer progress: ${progress}%`);
        },
        onComplete: (fileUrl) => {
          message.success('File transfer completed successfully!');
          console.log('File URL:', fileUrl);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        onError: (error) => {
          message.error(`Transfer failed: ${error.message}`);
          console.error('Transfer error:', error);
        },
      });
    } catch (error) {
      message.error(`Failed to start transfer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error starting transfer:', error);
    }
  }, [selectedFile, sendFileP2P, recipientId]);

  return (
    <div className="file-transfer-container">
      <div className="file-input-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isTransferring || !isConnected}
          style={{ display: 'none' }}
        />
        <Button
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isTransferring || !isConnected}
          style={{ marginRight: 8 }}
        >
          {selectedFile ? selectedFile.name : 'Select File'}
        </Button>
        
        <Button
          type="primary"
          onClick={handleSendFile}
          disabled={!selectedFile || isTransferring || !isConnected}
          loading={isTransferring}
        >
          {isTransferring ? 'Sending...' : 'Send File'}
        </Button>
      </div>
      
      {isTransferring && (
        <div className="progress-container" style={{ marginTop: 16 }}>
          <Progress percent={transferProgress} status="active" />
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            Transferring: {Math.round(transferProgress)}%
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: 8 }}>
          Error: {error.message}
        </div>
      )}
      
      {!isConnected && (
        <div style={{ color: 'orange', marginTop: 8 }}>
          Connecting to file transfer service...
        </div>
      )}
      
      <style>{`
        .file-transfer-container {
          padding: 16px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          max-width: 500px;
          margin: 0 auto;
        }
        .file-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .progress-container {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default FileTransfer;
