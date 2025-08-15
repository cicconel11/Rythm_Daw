import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { requestId, displayName, bio, avatarUrl } = req.body;
    const authHeader = req.headers.authorization;

    // Basic validation
    if (!requestId || !displayName || !bio) {
      return res.status(400).json({ message: 'Request ID, display name, and bio are required' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (bio.length > 140) {
      return res.status(400).json({ message: 'Bio must be 140 characters or less' });
    }

    // In a real implementation, you would:
    // 1. Validate the token
    // 2. Find the pending registration by requestId
    // 3. Update the user profile in the database
    // 4. Mark the registration as completed
    // 5. Create a session or JWT token for the user

    // Mock successful completion
    // Set the registration_completed cookie so middleware allows access to protected routes
    res.setHeader('Set-Cookie', [
      'registration_completed=true; Path=/; HttpOnly; SameSite=Lax',
      'registration_step1=true; Path=/; HttpOnly; SameSite=Lax'
    ]);
    
    return res.status(200).json({
      message: 'Profile completed successfully',
      user: {
        id: `user_${Date.now()}`,
        displayName,
        bio,
        avatarUrl,
        email: 'user@example.com', // This would come from the pending registration
      },
    });
  } catch (error) {
    console.error('Bio completion error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
