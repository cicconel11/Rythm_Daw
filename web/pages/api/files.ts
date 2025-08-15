import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Return files in the format expected by dataClient
      const files = [
        { id: '1', name: 'Project Alpha.wav', size: 45200000, status: 'inbox' as const },
        { id: '2', name: 'Mixdown Final.mp3', size: 12800000, status: 'sent' as const },
        { id: '3', name: 'Session Notes.pdf', size: 2100000, status: 'processing' as const },
        { id: '4', name: 'Bass Track.wav', size: 32000000, status: 'inbox' as const },
        { id: '5', name: 'Drum Loop.wav', size: 8500000, status: 'sent' as const }
      ];
      res.status(200).json(files);
    } catch (error) {
      console.error('Files API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST' && req.url?.includes('/upload')) {
    try {
      // Mock file upload response
      const uploadedFile = {
        id: Date.now().toString(),
        name: 'uploaded-file.wav',
        size: 1024000,
        status: 'inbox' as const,
      };
      res.status(200).json(uploadedFile);
    } catch (error) {
      console.error('File upload API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
