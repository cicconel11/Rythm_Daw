import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if email already exists (mock check)
    if (email === 'existing@example.com') {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Generate mock response data
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real implementation, you would:
    // 1. Hash the password
    // 2. Create the user in the database
    // 3. Generate a proper JWT token
    // 4. Send verification email

    // Set the step1 cookie so middleware allows access to bio page
    res.setHeader('Set-Cookie', 'registration_step1=true; Path=/; HttpOnly; SameSite=Lax');

    return res.status(200).json({
      message: 'Registration successful',
      requestId,
      token,
      email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
