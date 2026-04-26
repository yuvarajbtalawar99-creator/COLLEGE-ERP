"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitApplication = exports.createStudentAdmission = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const hashString = (data) => {
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
};
/* ================================
   CREATE ADMISSION (STEP 1)
 ================================ */
const createStudentAdmission = async (userId, admissionType, branchId, aadhaar, cetNumber, dcetNumber) => {
    // Check if admission already exists
    const existing = await prisma_1.default.student.findUnique({
        where: { userId }
    });
    if (existing) {
        throw new Error("Admission already created");
    }
    // Pre-calculate hashing if requested
    const aadhaarHash = aadhaar ? hashString(aadhaar) : null;
    // Double check uniqueness of Aadhaar Hash if provided
    if (aadhaarHash) {
        const duplicateAadhaar = await prisma_1.default.student.findUnique({
            where: { aadhaarHash }
        });
        if (duplicateAadhaar) {
            throw new Error("An application with this Aadhaar Number already exists.");
        }
    }
    // Double check uniqueness of CET Number if provided
    if (cetNumber && cetNumber.trim() !== "") {
        const duplicateCET = await prisma_1.default.student.findUnique({
            where: { cetNumber: cetNumber.toUpperCase() }
        });
        if (duplicateCET) {
            throw new Error("An application with this CET Number already exists.");
        }
    }
    // Double check uniqueness of DCET Number if provided
    if (dcetNumber && dcetNumber.trim() !== "") {
        const duplicateDCET = await prisma_1.default.student.findUnique({
            where: { dcetNumber: dcetNumber.toUpperCase() }
        });
        if (duplicateDCET) {
            throw new Error("An application with this DCET Number already exists.");
        }
    }
    try {
        const student = await prisma_1.default.student.create({
            data: {
                userId,
                admissionType: admissionType,
                branchId,
                aadhaarHash,
                cetNumber: (cetNumber && cetNumber.trim() !== "") ? cetNumber.toUpperCase() : null,
                dcetNumber: (dcetNumber && dcetNumber.trim() !== "") ? dcetNumber.toUpperCase() : null,
                status: "REGISTERED"
            }
        });
        return student;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const target = error.meta?.target || "";
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
exports.createStudentAdmission = createStudentAdmission;
/* ================================
   FINAL SUBMIT
 ================================ */
const submitApplication = async (userId) => {
    const student = await prisma_1.default.student.findUnique({
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
    if (student.status !== "REGISTERED" &&
        student.status !== "CORRECTION_REQUIRED" &&
        student.status !== "REJECTED") {
        throw new Error("Application already submitted or in a state that cannot be modified.");
    }
    if (!student.studentpersonaldetails ||
        !student.studentparentdetails ||
        !student.studentaddress ||
        !student.studentacademicdetails ||
        !student.studentdocuments) {
        throw new Error("Complete all steps before resubmission");
    }
    // If it was rejected, mark it as RESUBMITTED, otherwise SUBMITTED
    const nextStatus = student.status === "REJECTED" ? "RESUBMITTED" : "SUBMITTED";
    const updated = await prisma_1.default.student.update({
        where: { id: student.id },
        data: {
            status: nextStatus,
            submittedAt: new Date(),
            ...(nextStatus === "RESUBMITTED" ? { resubmittedAt: new Date() } : {})
        }
    });
    return updated;
};
exports.submitApplication = submitApplication;
