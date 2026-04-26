import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";
import crypto from "crypto";

const hashString = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

/* ================================
   CREATE ADMISSION (STEP 1)
 ================================ */

export const createStudentAdmission = async (
  userId: number,
  admissionType: string,
  branchId?: number,
  aadhaar?: string,
  cetNumber?: string,
  dcetNumber?: string
) => {

  // Check if admission already exists
  const existing = await prisma.student.findUnique({
    where: { userId }
  });

  if (existing) {
    throw new Error("Admission already created");
  }

  // Pre-calculate hashing if requested
  const aadhaarHash = aadhaar ? hashString(aadhaar) : null;

  // Double check uniqueness of Aadhaar Hash if provided
  if (aadhaarHash) {
    const duplicateAadhaar = await prisma.student.findUnique({
      where: { aadhaarHash }
    });
    if (duplicateAadhaar) {
      throw new Error("An application with this Aadhaar Number already exists.");
    }
  }

  // Double check uniqueness of CET Number if provided
  if (cetNumber && cetNumber.trim() !== "") {
    const duplicateCET = await prisma.student.findUnique({
      where: { cetNumber: cetNumber.toUpperCase() }
    });
    if (duplicateCET) {
      throw new Error("An application with this CET Number already exists.");
    }
  }

  // Double check uniqueness of DCET Number if provided
  if (dcetNumber && dcetNumber.trim() !== "") {
    const duplicateDCET = await prisma.student.findUnique({
      where: { dcetNumber: dcetNumber.toUpperCase() }
    });
    if (duplicateDCET) {
      throw new Error("An application with this DCET Number already exists.");
    }
  }

  try {
    const student = await prisma.student.create({
      data: {
        userId,
        admissionType: admissionType as any,
        branchId,
        aadhaarHash,
        cetNumber: (cetNumber && cetNumber.trim() !== "") ? cetNumber.toUpperCase() : null,
        dcetNumber: (dcetNumber && dcetNumber.trim() !== "") ? dcetNumber.toUpperCase() : null,
        status: "REGISTERED"
      }
    });

    return student;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string) || "";
        if (target.includes("cetNumber")) {
          throw new Error("An application with this CET Number already exists.");
        }
        if (target.includes("dcetNumber")) {
          throw new Error("An application with this DCET Number already exists.");
        }
        if (target.includes("aadhaarHash")) {
          throw new Error("An application with this Aadhaar Number already exists.");
        }
        if (target.includes("userId")) {
          throw new Error("Admission already created for this user.");
        }
      }
    }
    throw error;
  }
};


/* ================================
   FINAL SUBMIT
 ================================ */

export const submitApplication = async (userId: number) => {

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      studentpersonaldetails: true,
      studentparentdetails: true,
      studentaddress: true,
      studentacademicdetails: true,
      studentdocuments: true
    }
  });

  if (!student) {
    throw new Error("Admission not found");
  }

  if (
    student.status !== "REGISTERED" &&
    student.status !== "CORRECTION_REQUIRED" &&
    student.status !== "REJECTED"
  ) {
    throw new Error("Application already submitted or in a state that cannot be modified.");
  }

  if (
    !student.studentpersonaldetails ||
    !student.studentparentdetails ||
    !student.studentaddress ||
    !student.studentacademicdetails ||
    !student.studentdocuments
  ) {
    throw new Error("Complete all steps before resubmission");
  }

  // If it was rejected, mark it as RESUBMITTED, otherwise SUBMITTED
  const nextStatus = student.status === "REJECTED" ? "RESUBMITTED" : "SUBMITTED";

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      status: nextStatus as any,
      submittedAt: new Date(),
      ...(nextStatus === "RESUBMITTED" ? { resubmittedAt: new Date() } : {})
    }
  });

  return updated;
};