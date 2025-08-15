import type { NextApiRequest, NextApiResponse } from 'next';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  try {
    const url = new URL('/activities', SERVER_URL);
    
    // Add query parameters
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value) {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies for authentication
        ...(req.headers.cookie && { Cookie: req.headers.cookie }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    // Forward the response status and data
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Activities API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
