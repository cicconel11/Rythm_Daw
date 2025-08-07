import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]';

// Types
interface ValidateRequest {
  email: string;
  password: string;
  captchaToken: string;
}

/**
 * Verify reCAPTCHA token with Google's API
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });
    
    const data = await response.json();
    return data.success === true && data.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

/**
 * Validate user credentials
 */
function validateCredentials(email: string, password: string): { valid: boolean; message?: string } {
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  // Password validation
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  return { valid: true };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    // Check if user is already authenticated
    const session = await getServerSession(req, res, authOptions);
    if (session) {
      return res.status(400).json({ 
        success: false,
        message: 'Already authenticated' 
      });
    }

    const { email, password, captchaToken } = req.body as ValidateRequest;

    // Validate input
    if (!email || !password || !captchaToken) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(captchaToken);
    if (!isHuman) {
      return res.status(400).json({ 
        success: false,
        message: 'reCAPTCHA verification failed' 
      });
    }

    // Validate credentials
    const validation = validateCredentials(email, password);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false,
        message: validation.message 
      });
    }

    // In a real app, you might want to check if the email is already registered
    // const userExists = await prisma.user.findUnique({ where: { email } });
    // if (userExists) {
    //   return res.status(409).json({ 
    //     success: false,
    //     message: 'Email already in use' 
    //   });
    // }

    // Return success if all validations pass
    return res.status(200).json({ 
      success: true,
      message: 'Credentials are valid' 
    });

  } catch (error: any) {
    console.error('Validation error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred during validation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
