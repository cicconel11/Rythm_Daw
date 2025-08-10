import { randomUUID } from 'crypto';
import { z } from 'zod';
import { emailSchema } from './validation';

// Types
type Email = z.infer<typeof emailSchema>;

export interface PendingRegistration {
  id: string;
  email: Email;
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  token?: string;
  tokenExpiresAt?: Date;
}

export interface User {
  id: string;
  email: Email;
  displayName: string;
  passwordHash: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory stores
const pendingRegistrations = new Map<string, PendingRegistration>();
const users = new Map<string, User>();
const usedTokens = new Set<string>();

// Helper to generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store interface
export const store = {
  // Pending Registrations
  createPendingRegistration: (email: Email): PendingRegistration => {
    const existing = Array.from(pendingRegistrations.values()).find(
      (r) => r.email === email && r.expiresAt > new Date()
    );
    
    if (existing) {
      return existing;
    }

    const registration: PendingRegistration = {
      id: randomUUID(),
      email,
      code: generateCode(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      attempts: 0,
      verified: false,
    };

    pendingRegistrations.set(registration.id, registration);
    console.log(`[Store] Created registration for ${email} with code ${registration.code}`);
    
    return registration;
  },

  verifyPendingRegistration: (email: Email, code: string): { valid: boolean; registration?: PendingRegistration } => {
    const registration = Array.from(pendingRegistrations.values())
      .find(r => r.email === email && !r.verified && r.expiresAt > new Date());
    
    if (!registration) {
      return { valid: false };
    }

    registration.attempts += 1;
    
    if (registration.attempts > 5) {
      pendingRegistrations.delete(registration.id);
      return { valid: false };
    }

    if (registration.code !== code) {
      return { valid: false };
    }

    // Generate verification token
    registration.verified = true;
    registration.token = randomUUID();
    registration.tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    return { valid: true, registration };
  },

  getPendingRegistrationByToken: (token: string): PendingRegistration | undefined => {
    const registration = Array.from(pendingRegistrations.values())
      .find(r => r.token === token && r.tokenExpiresAt && r.tokenExpiresAt > new Date());
    return registration;
  },

  // Users
  createUser: (params: {
    email: Email;
    displayName: string;
    passwordHash: string;
    avatarUrl?: string | null;
  }): User => {
    if (this.getUserByEmail(params.email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: randomUUID(),
      email: params.email,
      displayName: params.displayName,
      passwordHash: params.passwordHash,
      avatarUrl: params.avatarUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(user.id, user);
    return user;
  },

  getUserByEmail: (email: Email): User | undefined => {
    return Array.from(users.values()).find(u => u.email === email);
  },

  // Token management
  invalidateToken: (token: string) => {
    usedTokens.add(token);
    
    // Clean up expired registrations and used tokens
    const now = new Date();
    
    // Clean up expired registrations
    for (const [id, reg] of pendingRegistrations.entries()) {
      if (reg.expiresAt < now) {
        pendingRegistrations.delete(id);
      }
    }
    
    // Clean up old used tokens (older than 1 hour)
    // Note: In a real implementation, you'd want a more sophisticated cleanup strategy
  },

  // For testing
  _clear: () => {
    pendingRegistrations.clear();
    users.clear();
    usedTokens.clear();
  },
};

export default store;
