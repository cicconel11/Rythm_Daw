import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        // Add other user properties as needed
      } & User;
    }
  }
}

export {}; // This file needs to be a module
