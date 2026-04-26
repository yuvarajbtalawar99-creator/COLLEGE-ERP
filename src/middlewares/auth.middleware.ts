import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export interface AuthUser {
  userId: number;
  role: string;
  supabaseUserId: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

type SupabaseJwtPayload = JWTPayload & {
  email?: string;
  phone?: string;
  app_metadata?: {
    role?: string;
  };
};

type CachedUser = {
  id: number;
  role: string;
  email: string;
  mobile: string | null;
  expiresAt: number;
};

const normalizeRole = (role?: string): "STUDENT" | "ADMISSION_OFFICER" | "SUPER_ADMIN" => {
  if (role === "ADMISSION_OFFICER" || role === "SUPER_ADMIN") {
    return role;
  }
  return "STUDENT";
};

const normalizePhone = (phone?: string | null) => {
  if (!phone) return null;
  const trimmed = String(phone).trim();
  return trimmed.length > 0 ? trimmed : null;
};

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not configured");
}
const jwks = createRemoteJWKSet(
  new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
);
const userCache = new Map<string, CachedUser>();
const USER_CACHE_TTL_MS = 60 * 1000;

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  (async () => {
    try {
      const { payload } = await jwtVerify(token, jwks, {
        issuer: `${process.env.SUPABASE_URL}/auth/v1`
      });
      const claims = payload as SupabaseJwtPayload;
      const supabaseUserId = claims.sub;

      if (!supabaseUserId) {
        return res.status(401).json({ message: "Invalid token subject" });
      }

      const role = normalizeRole(claims.app_metadata?.role);
      const cacheHit = userCache.get(supabaseUserId);
      const now = Date.now();
      const nextEmail = claims.email ?? `${supabaseUserId}@supabase.local`;
      const nextMobile = normalizePhone(claims.phone);
      const claimsChanged = !cacheHit ||
        cacheHit.email !== nextEmail ||
        cacheHit.mobile !== nextMobile ||
        cacheHit.role !== role;

      let user = cacheHit && cacheHit.expiresAt > now && !claimsChanged
        ? {
            id: cacheHit.id,
            role: cacheHit.role as any,
            email: cacheHit.email,
            mobile: cacheHit.mobile
          }
        : null;

      if (!user) {
        const existingUser = await prisma.user.findUnique({
          where: { supabaseUserId } as any
        });

        user = existingUser;
        if (!existingUser) {
          try {
            user = await prisma.user.create({
              data: {
                supabaseUserId,
                email: nextEmail,
                mobile: nextMobile as any,
                role
              }
            });
          } catch (createError: any) {
            // If phone value is already used by another account, don't block authentication.
            if (
              createError instanceof Prisma.PrismaClientKnownRequestError &&
              createError.code === "P2002"
            ) {
              user = await prisma.user.create({
                data: {
                  supabaseUserId,
                  email: nextEmail,
                  mobile: null as any,
                  role
                }
              });
            } else {
              throw createError;
            }
          }
        } else if (
          existingUser.email !== nextEmail ||
          existingUser.mobile !== nextMobile ||
          existingUser.role !== role
        ) {
          try {
            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                email: nextEmail,
                mobile: nextMobile as any,
                role
              }
            });
          } catch (updateError: any) {
            // If phone conflict happens, keep role/email update and clear mobile only for this user.
            if (
              updateError instanceof Prisma.PrismaClientKnownRequestError &&
              updateError.code === "P2002"
            ) {
              user = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  email: nextEmail,
                  mobile: null as any,
                  role
                }
              });
            } else {
              throw updateError;
            }
          }
        }

        userCache.set(supabaseUserId, {
          id: user!.id,
          role: user!.role,
          email: user!.email,
          mobile: user!.mobile ?? null,
          expiresAt: now + USER_CACHE_TTL_MS
        });
      }

      req.user = {
        userId: user!.id,
        role: user!.role,
        supabaseUserId,
        email: user!.email
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  })().catch(() => {
    return res.status(500).json({ message: "Authentication failed" });
  });
};