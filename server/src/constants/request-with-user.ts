import { Request } from 'express';

/** Canonical request shape used across the API */
export interface RequestWithUser extends Request {
  user: { userId: string; email: string; name?: string };
}
