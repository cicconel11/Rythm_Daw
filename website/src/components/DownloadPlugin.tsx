import { useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function DownloadPlugin() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const { url, filename } = await api<{ url: string; filename: string }>(
        '/plugins/latest',
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = filename ?? 'RythmInstaller.dmg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Download started 🎉');
    } catch {
      toast.error('Could not start download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700 disabled:opacity-60"
    >
      <Download className="h-5 w-5" />
      {loading ? 'Preparing…' : 'Download Plugin'}
    </button>
  );
}
