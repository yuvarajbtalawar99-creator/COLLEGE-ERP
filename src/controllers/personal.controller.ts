import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { savePersonalDetails } from "../services/personal.service";
import prisma from "../config/prisma";

export const addPersonalDetails = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({ message: "Admission not found" });
    }

    const personal = await savePersonalDetails(student.id, req.body);

    res.status(201).json({
      success: true,
      data: personal
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
