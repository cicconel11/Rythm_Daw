import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const plugins = getMockData.plugins();
      res.status(200).json(plugins);
    } catch (error) {
      console.error('Plugins API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST' && req.url?.includes('/scan')) {
    try {
      const scanResult = getMockData.scanPlugins();
      res.status(200).json(scanResult);
    } catch (error) {
      console.error('Plugin scan API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
