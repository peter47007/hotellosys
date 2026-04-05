// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\config\env.ts

/**
 * Environment configuration loader
 * Compatible with Node ES Modules
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Recreate __dirname in ES module scope
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load environment variables from backend/.env
 */
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

/**
 * Export environment configuration
 */
export const env = {
  PORT: process.env.PORT || "5000",
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_key",
  NODE_ENV: process.env.NODE_ENV || "development",
};