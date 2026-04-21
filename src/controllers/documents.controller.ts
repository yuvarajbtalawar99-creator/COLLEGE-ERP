import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { saveDocuments } from "../services/documents.service";

export const uploadDocuments = async (
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

    const documents = await saveDocuments(student.id, req.files);

    return res.status(201).json({
      success: true,
      data: documents
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};