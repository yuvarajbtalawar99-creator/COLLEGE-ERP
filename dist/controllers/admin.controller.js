"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDocuments = exports.assignUSN = exports.generateTempCollegeId = exports.updateStudentStatus = exports.getStudentById = exports.getStudents = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/* ===============================
   DASHBOARD STATS
================================*/
const getDashboardStats = async (req, res) => {
    try {
        const total = await prisma_1.default.student.count();
        const submitted = await prisma_1.default.student.count({
            where: { status: "SUBMITTED" }
        });
        const review = await prisma_1.default.student.count({
            where: { status: "UNDER_REVIEW" }
        });
        const confirmed = await prisma_1.default.student.count({
            where: { status: "ADMISSION_CONFIRMED" }
        });
        const rejected = await prisma_1.default.student.count({
            where: { status: "REJECTED" }
        });
        res.json({
            success: true,
            data: {
                total,
                submitted,
                review,
                confirmed,
                rejected
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
exports.getDashboardStats = getDashboardStats;
/* ===============================
   GET STUDENTS (FILTERABLE)
================================*/
const getStudents = async (req, res) => {
    try {
        const { status } = req.query;
        const students = await prisma_1.default.student.findMany({
            where: status ? { status: status } : {},
            include: {
                user: {
                    select: {
                        email: true,
                        mobile: true
                    }
                },
                branch: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json({
            success: true,
            data: students
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getStudents = getStudents;
/* ===============================
   FULL STUDENT PROFILE
================================*/
const getStudentById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await prisma_1.default.student.findUnique({
            where: { id },
            include: {
                user: true,
                branch: true,
                studentpersonaldetails: true,
                studentparentdetails: true,
                studentaddress: true,
                studentacademicdetails: true,
                studentdocuments: true
            }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
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
exports.getStudentById = getStudentById;
/* ===============================
   UPDATE ADMISSION STATUS
================================*/
const updateStudentStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const student = await prisma_1.default.student.update({
            where: { id },
            data: { status }
        });
        res.json({
            success: true,
            message: "Status updated",
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
exports.updateStudentStatus = updateStudentStatus;
/* ===============================
   GENERATE TEMP COLLEGE ID
================================*/
const generateTempCollegeId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await prisma_1.default.student.findUnique({
            where: { id },
            include: { branch: true }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        if (student.tempCollegeId) {
            return res.json({
                success: true,
                message: "Temp ID already generated",
                data: student
            });
        }
        const year = new Date().getFullYear().toString().slice(-2);
        const count = await prisma_1.default.student.count({
            where: {
                branchId: student.branchId
            }
        });
        const branchCode = student.branch?.code || "GEN";
        const tempId = `CLG${year}${branchCode}${String(count + 1).padStart(3, "0")}`;
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                tempCollegeId: tempId,
                status: "ADMISSION_CONFIRMED"
            }
        });
        res.json({
            success: true,
            message: "Temporary College ID generated",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.generateTempCollegeId = generateTempCollegeId;
/* ===============================
   ASSIGN VTU USN
================================*/
const assignUSN = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { usn } = req.body;
        const student = await prisma_1.default.student.update({
            where: { id },
            data: {
                vtuUsn: usn,
                status: "USN_ASSIGNED"
            }
        });
        res.json({
            success: true,
            message: "USN assigned",
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
exports.assignUSN = assignUSN;
/* ===============================
   DOCUMENT VERIFICATION
================================*/
const verifyDocuments = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { verified } = req.body;
        const student = await prisma_1.default.student.update({
            where: { id },
            data: {
                status: verified ? "UNDER_REVIEW" : "CORRECTION_REQUIRED"
            }
        });
        res.json({
            success: true,
            message: "Document verification updated",
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
exports.verifyDocuments = verifyDocuments;
