import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dashboardStats = getMockData.dashboardStats();
    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
