"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitApplication = exports.createStudentAdmission = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/* ================================
   CREATE ADMISSION (STEP 1)
================================ */
const createStudentAdmission = async (userId, admissionType, branchId) => {
    // Check if admission already exists
    const existing = await prisma_1.default.student.findUnique({
        where: { userId }
    });
    if (existing) {
        throw new Error("Admission already created");
    }
    const student = await prisma_1.default.student.create({
        data: {
            userId,
            admissionType: admissionType,
            branchId, // remove this if you are using enum branch
            status: "REGISTERED"
        }
    });
    return student;
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
        student.status !== "CORRECTION_REQUIRED") {
        throw new Error("Application already submitted");
    }
    if (!student.studentpersonaldetails ||
        !student.studentparentdetails ||
        !student.studentaddress ||
        !student.studentacademicdetails ||
        !student.studentdocuments) {
        throw new Error("Complete all steps before final submission");
    }
    const updated = await prisma_1.default.student.update({
        where: { id: student.id },
        data: {
            status: "SUBMITTED"
        }
    });
    return updated;
};
exports.submitApplication = submitApplication;
