// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\index.ts

/**
 * Main entry point for HotelloSys backend server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import apiRoutes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow frontend access
app.use(express.json()); // Parse JSON bodies
app.use('/api', apiRoutes);

// TODO: Routes should be imported from ./routes
// Currently removed duplicate login - see auth.controller.ts and routes/auth.routes.ts

app.get('/', (req, res) => {
  res.json({ status: 'HotelloSys API is running', version: '0.1.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hotello Backend running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL}`);
});