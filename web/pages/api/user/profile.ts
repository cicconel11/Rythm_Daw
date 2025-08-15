import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return a mock user profile
    const userProfile = {
      id: 'user1',
      username: 'djproducer',
      displayName: 'DJ Producer',
      status: 'online' as const,
      email: 'djproducer@example.com',
      avatar: '/api/placeholder/150/150',
      bio: 'Professional DJ and music producer',
      location: 'Los Angeles, CA',
      website: 'https://djproducer.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };
    
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('User profile API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
