import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        code: true
      },
      orderBy: {
        name: "asc"
      }
    });

    // Master data changes rarely; enable short caching for faster UX.
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json({
      success: true,
      data: branches
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch branches"
    });
  }
};