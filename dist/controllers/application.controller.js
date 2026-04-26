"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPDF = exports.getFullDetails = exports.getApplicationStatus = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const admission_template_1 = require("../templates/admission.template");
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
                studentId: student.id,
                tempCollegeId: student.tempCollegeId,
                rejectionRemark: student.rejectionRemark,
                timeline: {
                    submittedAt: student.submittedAt,
                    resubmittedAt: student.resubmittedAt,
                    reviewStartedAt: student.reviewStartedAt,
                    documentsVerifiedAt: student.documentsVerifiedAt,
                    approvedAt: student.approvedAt,
                    usnAssignedAt: student.usnAssignedAt,
                    rejectedAt: student.rejectedAt,
                }
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
// ✅ Get Full Application Details for Review
const getFullDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
            where: { userId },
            include: {
                studentpersonaldetails: true,
                studentparentdetails: true,
                studentaddress: {
                    include: {
                        district_studentaddress_DistrictIdTodistrict: {
                            include: { state: true }
                        },
                        district_studentaddress_permanentDistrictIdTodistrict: {
                            include: { state: true }
                        }
                    }
                },
                studentacademicdetails: true,
                studentdocuments: true,
                branch: true
            }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Application details not found"
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
exports.getFullDetails = getFullDetails;
// ✅ Download Acknowledgment PDF (High Quality via Puppeteer)
const downloadPDF = async (req, res) => {
    let browser;
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
            where: { userId },
            include: {
                studentpersonaldetails: true,
                studentparentdetails: true,
                studentaddress: {
                    include: {
                        district_studentaddress_DistrictIdTodistrict: {
                            include: { state: true }
                        },
                        district_studentaddress_permanentDistrictIdTodistrict: {
                            include: { state: true }
                        }
                    }
                },
                studentacademicdetails: true,
                studentdocuments: true,
                branch: true
            }
        });
        if (!student || student.status === "REGISTERED") {
            return res.status(400).json({
                success: false,
                message: "Application must be submitted to download acknowledgment"
            });
        }
        // Launch puppeteer
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        const htmlContent = (0, admission_template_1.getAdmissionTemplate)(student);
        await page.setDefaultNavigationTimeout(60000);
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.5in",
                right: "0.4in",
                bottom: "0.5in",
                left: "0.4in"
            }
        });
        await browser.close();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Admission_Acknowledgment_${student.id}.pdf`);
        res.send(pdfBuffer);
    }
    catch (error) {
        if (browser)
            await browser.close();
        console.error("PDF Generation Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Failed to generate professional PDF: " + error.message
            });
        }
    }
};
exports.downloadPDF = downloadPDF;
