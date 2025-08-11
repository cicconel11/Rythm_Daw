// Environment configuration with validation
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// API configuration
export const API_BASE = getRequiredEnvVar('RYTHM_API_BASE_URL');
export const WS_URL = getRequiredEnvVar('RYTHM_BRIDGE_WS');
export const TOKEN_SOURCE = 'cookie' as const;

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  // This will throw if any required env vars are missing
  getRequiredEnvVar('RYTHM_API_BASE_URL');
  getRequiredEnvVar('RYTHM_BRIDGE_WS');
}
