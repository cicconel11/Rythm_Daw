// Shared in-memory storage for demo purposes
export const pendingRegistrations = new Map<string, any>();
export const users: any[] = [];

// Add some persistence to prevent token loss
const STORAGE_FILE = '/tmp/registration-storage.json';

// Try to load existing data on startup
try {
  if (typeof window === 'undefined') {
    const fs = require('fs');
    if (fs.existsSync(STORAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
      data.pendingRegistrations.forEach((reg: any) => {
        pendingRegistrations.set(reg.requestId, reg);
      });
      users.push(...data.users);
      console.log('Loaded persistent storage:', { 
        pendingCount: pendingRegistrations.size, 
        usersCount: users.length 
      });
    }
  }
} catch (error) {
  console.log('Could not load persistent storage:', error);
}

// Function to save data
function saveToFile() {
  try {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const data = {
        pendingRegistrations: Array.from(pendingRegistrations.values()),
        users: users
      };
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('Could not save persistent storage:', error);
  }
}

export function validateToken(authHeader: string): string | null {
  console.log('validateToken called with:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid auth header format');
    return null;
  }
  
  const token = authHeader.substring(7);
  console.log('Extracted token:', token);
  console.log('Current pending registrations:', Array.from(pendingRegistrations.values()).map(reg => ({ requestId: reg.requestId, tempToken: reg.tempToken })));
  
  // Find pending registration with this token
  const pendingRegistration = Array.from(pendingRegistrations.values()).find(
    (reg: any) => reg.tempToken === token
  );
  
  console.log('Found pending registration:', pendingRegistration ? pendingRegistration.requestId : 'none');
  
  return pendingRegistration ? pendingRegistration.requestId : null;
}

// Export functions to manage storage
export function addPendingRegistration(registration: any) {
  pendingRegistrations.set(registration.requestId, registration);
  saveToFile();
}

export function removePendingRegistration(requestId: string) {
  pendingRegistrations.delete(requestId);
  saveToFile();
}

export function addUser(user: any) {
  users.push(user);
  saveToFile();
}
