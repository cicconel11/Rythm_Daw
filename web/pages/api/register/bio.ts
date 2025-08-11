import { NextApiRequest, NextApiResponse } from 'next';
import { pendingRegistrations, users, validateToken, removePendingRegistration, addUser } from '../auth/register/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { requestId, bio, avatarUrl } = req.body;
    const authHeader = req.headers.authorization;

    console.log('Bio API called with:', { requestId, bio, avatarUrl });
    console.log('Auth header:', authHeader);
    console.log('Current pending registrations:', Array.from(pendingRegistrations.keys()));

    // Validate token
    const validRequestId = validateToken(authHeader || '');
    console.log('Validated requestId:', validRequestId);
    console.log('Expected requestId:', requestId);
    
    if (!validRequestId || validRequestId !== requestId) {
      console.log('Token validation failed');
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get pending registration
    const pendingRegistration = pendingRegistrations.get(requestId);
    console.log('Found pending registration:', pendingRegistration ? 'yes' : 'no');
    
    if (!pendingRegistration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (pendingRegistration.completed) {
      return res.status(400).json({ message: 'Registration already completed' });
    }

    // Basic validation
    if (!bio || !bio.trim()) {
      return res.status(400).json({ message: 'Bio is required' });
    }

    // Update pending registration with bio data
    pendingRegistration.bio = bio.trim();
    pendingRegistration.avatarUrl = avatarUrl || null;
    pendingRegistration.completed = true;
    pendingRegistration.completedAt = new Date().toISOString();

    // Move to users array (simulating database save)
    const user = {
      id: requestId,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      displayName: pendingRegistration.displayName,
      bio: pendingRegistration.bio,
      avatarUrl: pendingRegistration.avatarUrl,
      createdAt: pendingRegistration.createdAt,
      updatedAt: new Date().toISOString(),
    };

    addUser(user);
    removePendingRegistration(requestId);

    console.log('Completed registration:', { requestId, email: user.email });

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Registration completed successfully',
      userId: requestId,
    });
  } catch (error) {
    console.error('Bio update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
