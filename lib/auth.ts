import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  return { id: admin.id, email: admin.email, name: admin.name };
}
