"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jose_1 = require("jose");
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const normalizeRole = (role) => {
    if (role === "ADMISSION_OFFICER" || role === "SUPER_ADMIN") {
        return role;
    }
    return "STUDENT";
};
const normalizePhone = (phone) => {
    if (!phone)
        return null;
    const trimmed = String(phone).trim();
    return trimmed.length > 0 ? trimmed : null;
};
const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
}
const jwks = (0, jose_1.createRemoteJWKSet)(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`));
const userCache = new Map();
const USER_CACHE_TTL_MS = 60 * 1000;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    (async () => {
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, jwks, {
                issuer: `${process.env.SUPABASE_URL}/auth/v1`
            });
            const claims = payload;
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
                    role: cacheHit.role,
                    email: cacheHit.email,
                    mobile: cacheHit.mobile
                }
                : null;
            if (!user) {
                const existingUser = await prisma_1.default.user.findUnique({
                    where: { supabaseUserId }
                });
                user = existingUser;
                if (!existingUser) {
                    try {
                        user = await prisma_1.default.user.create({
                            data: {
                                supabaseUserId,
                                email: nextEmail,
                                mobile: nextMobile,
                                role
                            }
                        });
                    }
                    catch (createError) {
                        // If phone value is already used by another account, don't block authentication.
                        if (createError instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                            createError.code === "P2002") {
                            user = await prisma_1.default.user.create({
                                data: {
                                    supabaseUserId,
                                    email: nextEmail,
                                    mobile: null,
                                    role
                                }
                            });
                        }
                        else {
                            throw createError;
                        }
                    }
                }
                else if (existingUser.email !== nextEmail ||
                    existingUser.mobile !== nextMobile ||
                    existingUser.role !== role) {
                    try {
                        user = await prisma_1.default.user.update({
                            where: { id: existingUser.id },
                            data: {
                                email: nextEmail,
                                mobile: nextMobile,
                                role
                            }
                        });
                    }
                    catch (updateError) {
                        // If phone conflict happens, keep role/email update and clear mobile only for this user.
                        if (updateError instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                            updateError.code === "P2002") {
                            user = await prisma_1.default.user.update({
                                where: { id: existingUser.id },
                                data: {
                                    email: nextEmail,
                                    mobile: null,
                                    role
                                }
                            });
                        }
                        else {
                            throw updateError;
                        }
                    }
                }
                userCache.set(supabaseUserId, {
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    mobile: user.mobile ?? null,
                    expiresAt: now + USER_CACHE_TTL_MS
                });
            }
            req.user = {
                userId: user.id,
                role: user.role,
                supabaseUserId,
                email: user.email
            };
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    })().catch(() => {
        return res.status(500).json({ message: "Authentication failed" });
    });
};
exports.verifyToken = verifyToken;
