import { useTransfers } from '@shared/hooks/useTransfers';
import { useFileUpload } from '@shared/hooks/useFileUpload';
import { useTransferActions } from '@shared/hooks/useTransferActions';
import { useState } from 'react';

export default function FileShare() {
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
    <div>
      <h2>File Transfers</h2>
      <div>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <input type="text" placeholder="Recipient User ID" value={toUserId} onChange={e => setToUserId(e.target.value)} />
        <button onClick={handleUpload} disabled={upload.status === 'pending'}>Upload</button>
      </div>
      {isLoading ? <div>Loading...</div> : (
        <ul>
          {transfers?.map(t => (
            <li key={t.id}
              draggable
              onDragStart={async e => {
                e.dataTransfer.effectAllowed = 'copy';
                const url = await downloadUrl(t.id);
                e.dataTransfer.setData('DownloadURL', `${t.file.type}:${t.file.name}:${url}`);
              }}
            >
              <span>{t.fileName} ({t.status})</span>
              <button onClick={() => accept.mutate(t.id)} disabled={t.status !== 'pending'}>Accept</button>
              <button onClick={() => decline.mutate(t.id)} disabled={t.status !== 'pending'}>Decline</button>
              <button onClick={() => download.mutate(t.id)} disabled={t.status !== 'accepted'}>Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
