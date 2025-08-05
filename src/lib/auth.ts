// Simple authentication system for admin access
// In production, you'd want to use a proper auth provider like NextAuth.js

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

// Admin credentials (in production, use environment variables)
const ADMIN_CREDENTIALS = {
  password: process.env.ADMIN_PASSWORD || "admin123",
  token: process.env.ADMIN_TOKEN || "your-secret-admin-token",
};

// Check if user is authenticated as admin
export function isAdminAuthenticated(token: string | null): boolean {
  if (!token) return false;
  return token === ADMIN_CREDENTIALS.token;
}

// Verify admin password
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_CREDENTIALS.password;
}

// Generate admin token
export function generateAdminToken(): string {
  return ADMIN_CREDENTIALS.token;
}

// Mock admin user data
export const ADMIN_USER: AdminUser = {
  id: "1",
  name: "Shivraj Soni",
  email: "shivrajsoni09022005@gmail.com",
  role: "admin",
};
