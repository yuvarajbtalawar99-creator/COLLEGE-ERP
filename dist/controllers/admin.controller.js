"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignUSN = exports.generateTempCollegeId = exports.rejectApplication = exports.approveAdmission = exports.verifyDocuments = exports.updateDocChecks = exports.startReview = exports.updateStudentStatus = exports.getStudentById = exports.getStudents = exports.getDashboardStats = void 0;
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
        const documentVerified = await prisma_1.default.student.count({
            where: { status: "DOCUMENT_VERIFIED" }
        });
        const confirmed = await prisma_1.default.student.count({
            where: { status: "ADMISSION_CONFIRMED" }
        });
        const rejected = await prisma_1.default.student.count({
            where: { status: "REJECTED" }
        });
        const resubmitted = await prisma_1.default.student.count({
            where: { status: "RESUBMITTED" }
        });
        res.json({
            success: true,
            data: {
                total,
                submitted,
                resubmitted,
                review,
                documentVerified,
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
        const { status, branchId, search, dateFrom, dateTo } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (branchId) {
            where.branchId = Number(branchId);
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                where.createdAt.lte = to;
            }
        }
        if (search) {
            const q = search.trim();
            where.OR = [
                { user: { email: { contains: q } } },
                { user: { mobile: { contains: q } } },
                { studentpersonaldetails: { fullName: { contains: q } } },
                { tempCollegeId: { contains: q } },
            ];
        }
        const students = await prisma_1.default.student.findMany({
            where,
            include: {
                user: {
                    select: {
                        email: true,
                        mobile: true
                    }
                },
                branch: true,
                studentpersonaldetails: {
                    select: {
                        fullName: true
                    }
                }
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
   UPDATE ADMISSION STATUS (GENERIC)
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
   START REVIEW
================================*/
const startReview = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await prisma_1.default.student.findUnique({ where: { id } });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.status !== "SUBMITTED" && student.status !== "RESUBMITTED") {
            return res.status(400).json({
                success: false,
                message: `Cannot start review. Current status: ${student.status}`
            });
        }
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                status: "UNDER_REVIEW",
                reviewStartedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Review started",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.startReview = startReview;
/* ===============================
   UPDATE DOCUMENT VERIFICATION CHECKS
================================*/
const updateDocChecks = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { photoVerified, signatureVerified, marksCardVerified } = req.body;
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                photoVerified: !!photoVerified,
                signatureVerified: !!signatureVerified,
                marksCardVerified: !!marksCardVerified
            }
        });
        res.json({
            success: true,
            message: "Verification checks updated",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateDocChecks = updateDocChecks;
/* ===============================
   VERIFY DOCUMENTS (STATUS CHANGE)
================================*/
const verifyDocuments = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await prisma_1.default.student.findUnique({ where: { id } });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.status !== "UNDER_REVIEW") {
            return res.status(400).json({
                success: false,
                message: `Cannot verify documents. Current status: ${student.status}`
            });
        }
        if (!student.photoVerified || !student.signatureVerified || !student.marksCardVerified) {
            return res.status(400).json({
                success: false,
                message: "All document verification checks must be completed before marking as verified"
            });
        }
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                status: "DOCUMENT_VERIFIED",
                documentsVerifiedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Documents verified successfully",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.verifyDocuments = verifyDocuments;
/* ===============================
   APPROVE ADMISSION
================================*/
const approveAdmission = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = await prisma_1.default.student.findUnique({
            where: { id },
            include: { branch: true }
        });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.status !== "DOCUMENT_VERIFIED") {
            return res.status(400).json({
                success: false,
                message: `Cannot approve. Current status: ${student.status}. Documents must be verified first.`
            });
        }
        // Generate temp college ID
        let tempCollegeId = student.tempCollegeId;
        if (!tempCollegeId) {
            const year = new Date().getFullYear().toString().slice(-2);
            const count = await prisma_1.default.student.count({
                where: { branchId: student.branchId }
            });
            const branchCode = student.branch?.code || "GEN";
            tempCollegeId = `CLG${year}${branchCode}${String(count + 1).padStart(3, "0")}`;
        }
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                status: "ADMISSION_CONFIRMED",
                tempCollegeId,
                approvedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Admission approved and College ID generated",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.approveAdmission = approveAdmission;
/* ===============================
   REJECT APPLICATION
================================*/
const rejectApplication = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { remark } = req.body;
        if (!remark || !remark.trim()) {
            return res.status(400).json({
                success: false,
                message: "Rejection remark is required"
            });
        }
        const student = await prisma_1.default.student.findUnique({ where: { id } });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.status === "ADMISSION_CONFIRMED" || student.status === "USN_ASSIGNED") {
            return res.status(400).json({
                success: false,
                message: "Cannot reject an already confirmed admission"
            });
        }
        const updated = await prisma_1.default.student.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionRemark: remark.trim(),
                rejectedAt: new Date()
            }
        });
        res.json({
            success: true,
            message: "Application rejected",
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.rejectApplication = rejectApplication;
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
                status: "ADMISSION_CONFIRMED",
                approvedAt: new Date()
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
                status: "USN_ASSIGNED",
                usnAssignedAt: new Date()
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
