import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, mobile, password, role } = req.body;

    const user = await registerUser(email, mobile, password, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      token: result.token
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};