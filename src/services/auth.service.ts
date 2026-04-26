import prisma from "../config/prisma";
import { user_role } from "@prisma/client";

const normalizeRole = (role?: string): user_role => {
  if (role === "ADMISSION_OFFICER") return "ADMISSION_OFFICER";
  if (role === "SUPER_ADMIN") return "SUPER_ADMIN";
  return "STUDENT";
};

export const syncSupabaseUser = async (
  supabaseUserId: string,
  email: string,
  mobile?: string | null,
  role?: string
) => {
  const normalizedRole = normalizeRole(role);
  const user = await prisma.user.upsert({
    where: { supabaseUserId } as any,
    update: {
      email,
      mobile: (mobile || null) as any,
      role: normalizedRole
    },
    create: {
      supabaseUserId,
      email,
      mobile: (mobile || null) as any,
      role: normalizedRole
    }
  });
  return user;
};

export const getCurrentUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      mobile: true,
      role: true,
      supabaseUserId: true as any
    }
  });
  if (!user) throw new Error("User not found");
  return user;
};