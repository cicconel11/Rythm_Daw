/**
 * List of STUN servers for WebRTC connections
 * Configured via STUN_SERVERS environment variable (comma-separated)
 * Defaults to Google's public STUN servers if not specified
 */
const DEFAULT_STUN_SERVERS = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
];

export const STUN_SERVERS =
  typeof process !== "undefined" && process.env.STUN_SERVERS
    ? process.env.STUN_SERVERS.split(",").map((s) => s.trim())
    : DEFAULT_STUN_SERVERS;

/**
 * Get STUN server configuration for WebRTC
 * @returns Array of RTCIceServer objects
 */
export function getIceServers(): RTCIceServer[] {
  return STUN_SERVERS.map((url) => ({
    urls: url,
  }));
}
