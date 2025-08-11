import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { addPendingRegistration, users } from './register/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, displayName, captchaToken } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Check if there's already a pending registration for this email
    const { pendingRegistrations } = await import('./register/storage');
    const existingPending = Array.from(pendingRegistrations.values()).find(
      (reg: any) => reg.email === email
    );
    if (existingPending) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Generate unique identifiers
    const requestId = uuidv4();
    const tempToken = uuidv4();

    // Store pending registration
    const pendingRegistration = {
      email,
      password,
      displayName: displayName || email.split('@')[0],
      requestId,
      tempToken,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    addPendingRegistration(pendingRegistration);

    console.log('Created pending registration:', { requestId, email, tempToken });

    // Return success with requestId and token
    return res.status(200).json({
      success: true,
      message: 'Registration initiated successfully',
      requestId,
      token: tempToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
