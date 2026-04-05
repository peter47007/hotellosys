// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // REMOVE 'engine: "classic"' or comment it out
  datasource: {
    url: env("DATABASE_URL"),
  },
});