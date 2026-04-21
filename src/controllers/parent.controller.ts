import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";
import { saveParentDetails } from "../services/parent.service";

export const addParentDetails = async (
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

    const parent = await saveParentDetails(student.id, req.body);

    res.status(201).json({
      success: true,
      data: parent
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};