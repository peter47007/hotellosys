// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\routes\index.ts

/**
 * Main API router
 * This file can be used to aggregate all route modules in the future
 */

import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

/**
 * Root API route
 */
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to HotelloSys API",
  });
});

export default router;