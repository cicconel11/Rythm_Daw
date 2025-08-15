import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const settings = getMockData.settings();
      res.status(200).json(settings);
    } catch (error) {
      console.error('Settings API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedSettings = { ...getMockData.settings(), ...req.body };
      res.status(200).json(updatedSettings);
    } catch (error) {
      console.error('Settings update API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
