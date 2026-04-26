"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmail = exports.checkCetNumber = exports.checkAadhaar = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a SHA-256 hash for a given string.
 */
const hashString = (data) => {
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
};
/**
 * Checks if a hashed Aadhaar already exists in the database.
 */
const checkAadhaar = async (req, res) => {
    try {
        const { aadhaar } = req.body;
        if (!aadhaar || aadhaar.length !== 12 || isNaN(Number(aadhaar))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Aadhaar format. Must be a 12-digit number.",
            });
        }
        const hashedAadhaar = hashString(aadhaar);
        const existingStudent = await prisma_1.default.student.findUnique({
            where: { aadhaarHash: hashedAadhaar },
        });
        return res.status(200).json({
            success: true,
            exists: !!existingStudent,
        });
    }
    catch (error) {
        console.error("Error checking Aadhaar:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during Aadhaar validation.",
        });
    }
};
exports.checkAadhaar = checkAadhaar;
/**
 * Checks if a CET/DCET number already exists.
 */
const checkCetNumber = async (req, res) => {
    try {
        const { cetNumber, type } = req.body;
        if (!cetNumber) {
            return res.status(400).json({
                success: false,
                message: "CET number is required.",
            });
        }
        const whereClause = type === "DCET"
            ? { dcetNumber: cetNumber.toUpperCase() }
            : { cetNumber: cetNumber.toUpperCase() };
        const existingStudent = await prisma_1.default.student.findFirst({
            where: whereClause,
        });
        return res.status(200).json({
            success: true,
            exists: !!existingStudent,
        });
    }
    catch (error) {
        console.error("Error checking CET number:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during CET validation.",
        });
    }
};
exports.checkCetNumber = checkCetNumber;
/**
 * Checks if an email is already associated with an account.
 */
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        return res.status(200).json({
            success: true,
            exists: !!existingUser,
        });
    }
    catch (error) {
        console.error("Error checking email:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during email validation.",
        });
    }
};
exports.checkEmail = checkEmail;
