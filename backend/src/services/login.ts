import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        roleId: true,
        tenantId: true,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      {
        sub: user.id,
        tenantId: user.tenantId,
        role: user.roleId,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove password before returning user
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error("Error in login:", error);
    throw error;
  }
}
