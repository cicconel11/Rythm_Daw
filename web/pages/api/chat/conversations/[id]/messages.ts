import { NextApiRequest, NextApiResponse } from 'next';
import { getMockData } from '@/lib/mocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const messages = getMockData.messages();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Chat messages API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const newMessage = {
        id: Date.now().toString(),
        content,
        sender: 'user1',
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      };
      res.status(200).json(newMessage);
    } catch (error) {
      console.error('Send message API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
