import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createStudentAdmission,
  submitApplication
} from "../services/student.service";

// ✅ Create Admission
export const createAdmission = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { admissionType, branchId, aadhaar, cetNumber, dcetNumber } = req.body;

    const userId = req.user.userId;

    const student = await createStudentAdmission(
      userId,
      admissionType,
      branchId,
      aadhaar,
      cetNumber,
      dcetNumber
    );

    res.status(201).json({
      success: true,
      data: student
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Get My Admission
export const getMyAdmission = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        studentpersonaldetails: true,
        studentparentdetails: true,
        studentaddress: true,
        studentacademicdetails: true,
        studentdocuments: true,
        branch: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Admission not found"
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Final Submit

export const finalSubmit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await submitApplication(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data: result
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};