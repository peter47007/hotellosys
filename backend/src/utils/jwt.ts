// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\utils\jwt.ts

/**
 * Utility functions for JSON Web Token creation and verification
 */

import jwt from "jsonwebtoken";
import { env } from "../config/env";

/**
 * Generate JWT token
 */
export function generateToken(payload: object): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}