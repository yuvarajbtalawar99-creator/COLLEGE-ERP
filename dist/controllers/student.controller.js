"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalSubmit = exports.getMyAdmission = exports.createAdmission = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const student_service_1 = require("../services/student.service");
// ✅ Create Admission
const createAdmission = async (req, res) => {
    try {
        const { admissionType, branchId, aadhaar, cetNumber, dcetNumber } = req.body;
        const userId = req.user.userId;
        const student = await (0, student_service_1.createStudentAdmission)(userId, admissionType, branchId, aadhaar, cetNumber, dcetNumber);
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
