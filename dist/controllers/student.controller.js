"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalSubmit = exports.getApplicationStatus = exports.getMyAdmission = exports.createAdmission = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const student_service_1 = require("../services/student.service");
// ✅ Create Admission
const createAdmission = async (req, res) => {
    try {
        const { admissionType, branchId } = req.body;
        const userId = req.user.userId;
        const student = await (0, student_service_1.createStudentAdmission)(userId, admissionType, branchId);
        res.status(201).json({
            success: true,
            data: student
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.createAdmission = createAdmission;
// ✅ Get My Admission
const getMyAdmission = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getMyAdmission = getMyAdmission;
// ✅ Get Application Step Status
const getApplicationStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
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
        const isSubmitted = student.status !== "REGISTERED" &&
            student.status !== "CORRECTION_REQUIRED";
        const steps = {
            admission: true, // Always true if student record exists
            personalDetails: !!student.studentpersonaldetails,
            parentDetails: !!student.studentparentdetails,
            addressDetails: !!student.studentaddress,
            academicDetails: !!student.studentacademicdetails,
            documents: !!student.studentdocuments,
            review: isSubmitted,
        };
        // Count completed steps
        const stepValues = Object.values(steps);
        const completedCount = stepValues.filter(Boolean).length;
        const totalSteps = stepValues.length;
        const progressPercent = Math.round((completedCount / totalSteps) * 100);
        // Determine the active step index (1-based)
        let activeStepIndex = 1;
        const stepKeys = Object.keys(steps);
        for (let i = 0; i < stepKeys.length; i++) {
            if (!steps[stepKeys[i]]) {
                activeStepIndex = i + 1;
                break;
            }
            if (i === stepKeys.length - 1) {
                activeStepIndex = stepKeys.length; // All complete
            }
        }
        res.json({
            success: true,
            data: {
                steps,
                completedCount,
                totalSteps,
                progressPercent,
                activeStepIndex,
                applicationStatus: student.status,
                studentId: student.id
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getApplicationStatus = getApplicationStatus;
// ✅ Final Submit
const finalSubmit = async (req, res) => {
    try {
        const result = await (0, student_service_1.submitApplication)(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Application submitted successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.finalSubmit = finalSubmit;
