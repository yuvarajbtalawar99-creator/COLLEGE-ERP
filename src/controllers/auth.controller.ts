import { Request, Response } from "express";
import { getCurrentUserProfile, syncSupabaseUser } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { supabaseUserId, email, mobile, role } = req.body;
    if (!supabaseUserId || !email) {
      return res.status(400).json({
        success: false,
        message: "supabaseUserId and email are required"
      });
    }

    const user = await syncSupabaseUser(supabaseUserId, email, mobile, role);

    res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: user
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const profile = await getCurrentUserProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};