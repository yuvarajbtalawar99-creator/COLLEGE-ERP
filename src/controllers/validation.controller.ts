import { Request, Response } from "express";
import prisma from "../config/prisma";
import crypto from "crypto";

/**
 * Generates a SHA-256 hash for a given string.
 */
const hashString = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

/**
 * Checks if a hashed Aadhaar already exists in the database.
 */
export const checkAadhaar = async (req: Request, res: Response) => {
  try {
    const { aadhaar } = req.body;

    if (!aadhaar || aadhaar.length !== 12 || isNaN(Number(aadhaar))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar format. Must be a 12-digit number.",
      });
    }

    const hashedAadhaar = hashString(aadhaar);

    const existingStudent = await prisma.student.findUnique({
      where: { aadhaarHash: hashedAadhaar },
    });

    return res.status(200).json({
      success: true,
      exists: !!existingStudent,
    });
  } catch (error) {
    console.error("Error checking Aadhaar:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during Aadhaar validation.",
    });
  }
};

/**
 * Checks if a CET/DCET number already exists.
 */
export const checkCetNumber = async (req: Request, res: Response) => {
  try {
    const { cetNumber, type } = req.body;

    if (!cetNumber) {
      return res.status(400).json({
        success: false,
        message: "CET number is required.",
      });
    }

    const whereClause = type === "DCET" 
      ? { dcetNumber: cetNumber.toUpperCase() } 
      : { cetNumber: cetNumber.toUpperCase() };

    const existingStudent = await prisma.student.findFirst({
      where: whereClause,
    });

    return res.status(200).json({
      success: true,
      exists: !!existingStudent,
    });
  } catch (error) {
    console.error("Error checking CET number:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during CET validation.",
    });
  }
};

/**
 * Checks if an email is already associated with an account.
 */
export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return res.status(200).json({
      success: true,
      exists: !!existingUser,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during email validation.",
    });
  }
};
