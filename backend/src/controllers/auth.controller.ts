// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\controllers\auth.controllers.ts

// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\controllers\auth.controllers.ts

import { prisma } from "../lib/prisma";
import { generateToken, verifyToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.employees.findFirst({
      where: { username },
      include: { hotel: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let validPassword = await comparePassword(password, user.passwordHash);
    const legacyPassword = !validPassword && user.passwordHash === password;

    if (!validPassword && legacyPassword) {
      // Upgrade legacy plaintext password to a bcrypt hash
      const hashed = await hashPassword(password);
      await prisma.employees.update({
        where: { employeeId: user.employeeId },
        data: { passwordHash: hashed },
      });
      validPassword = true;
    }

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.employeeId });

    res.json({ user, token });
  } catch (error) {
    console.error(error); // Log the real error to your console
    res.status(500).json({ error: "Database query failed" });
  }
};

export const me = async (req: any, res: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token) as { userId: number };
    const user = await prisma.employees.findUnique({
      where: { employeeId: payload.userId },
      include: { hotel: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};