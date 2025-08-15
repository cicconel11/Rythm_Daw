import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Return friends in the format expected by dataClient
      const friends = [
        { id: '1', name: 'BeatMaker99', online: true, compatibility: 'High' },
        { id: '2', name: 'ProducerX', online: false },
        { id: '3', name: 'SynthMaster', online: true, compatibility: 'Medium' },
        { id: '4', name: 'DJ Producer', online: true, compatibility: 'High' },
        { id: '5', name: 'SoundDesigner', online: false }
      ];
      res.status(200).json(friends);
    } catch (error) {
      console.error('Friends API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
