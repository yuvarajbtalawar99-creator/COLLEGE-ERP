"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.syncUser = void 0;
const auth_service_1 = require("../services/auth.service");
const syncUser = async (req, res) => {
    try {
        const { supabaseUserId, email, mobile, role } = req.body;
        if (!supabaseUserId || !email) {
            return res.status(400).json({
                success: false,
                message: "supabaseUserId and email are required"
            });
        }
        const user = await (0, auth_service_1.syncSupabaseUser)(supabaseUserId, email, mobile, role);
        res.status(201).json({
            success: true,
            message: "User synced successfully",
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.syncUser = syncUser;
const me = async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const profile = await (0, auth_service_1.getCurrentUserProfile)(req.user.userId);
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.me = me;
