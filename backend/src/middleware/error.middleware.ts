// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\middleware\error.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Global error handler middleware
 * Any thrown error in controllers/services will be captured here
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}