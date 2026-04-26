"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserProfile = exports.syncSupabaseUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const normalizeRole = (role) => {
    if (role === "ADMISSION_OFFICER")
        return "ADMISSION_OFFICER";
    if (role === "SUPER_ADMIN")
        return "SUPER_ADMIN";
    return "STUDENT";
};
const syncSupabaseUser = async (supabaseUserId, email, mobile, role) => {
    const normalizedRole = normalizeRole(role);
    const user = await prisma_1.default.user.upsert({
        where: { supabaseUserId },
        update: {
            email,
            mobile: (mobile || null),
            role: normalizedRole
        },
        create: {
            supabaseUserId,
            email,
            mobile: (mobile || null),
            role: normalizedRole
        }
    });
    return user;
};
exports.syncSupabaseUser = syncSupabaseUser;
const getCurrentUserProfile = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            mobile: true,
            role: true,
            supabaseUserId: true
        }
    });
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.getCurrentUserProfile = getCurrentUserProfile;
