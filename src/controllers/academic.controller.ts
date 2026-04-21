import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { saveAcademicDetails } from "../services/academic.service";

export const addAcademicDetails = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Admission not found"
      });
    }

    const academic = await saveAcademicDetails(student.id, req.body);

    return res.status(201).json({
      success: true,
      data: academic
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};