import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { saveAddressDetails } from "../services/address.service";

export const addAddressDetails = async (
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

    const address = await saveAddressDetails(student.id, req.body);

    return res.status(201).json({
      success: true,
      data: address
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getDistricts = async (req: AuthRequest, res: Response) => {
  try {
    const districts = await prisma.district.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: districts
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch districts"
    });
  }
};