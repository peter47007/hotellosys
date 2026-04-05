// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\utils\password.ts

/**
 * Utility functions for password hashing and comparison
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}