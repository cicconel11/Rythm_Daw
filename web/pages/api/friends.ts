import { NextApiRequest, NextApiResponse } from 'next';

// Mock friends data
const mockFriends = [
  {
    id: '1',
    name: 'Alex Johnson',
    status: 'online',
    lastSeen: new Date().toISOString(),
    avatarUrl: 'https://via.placeholder.com/40',
    mutualFriends: 3,
  },
  {
    id: '2',
    name: 'Sam Wilson',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    avatarUrl: 'https://via.placeholder.com/40',
    mutualFriends: 1,
  },
  {
    id: '3',
    name: 'Taylor Swift',
    status: 'online',
    lastSeen: new Date().toISOString(),
    avatarUrl: 'https://via.placeholder.com/40',
    mutualFriends: 5,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simulate a small delay
  setTimeout(() => {
    res.status(200).json(mockFriends);
  }, 100);
}
