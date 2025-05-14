/**
 * Generates a simple unique ID
 * Not as robust as UUID but sufficient for most client-side use cases
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}