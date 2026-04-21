"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAcademicDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const academic_service_1 = require("../services/academic.service");
const addAcademicDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
            where: { userId }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Admission not found"
            });
        }
        const academic = await (0, academic_service_1.saveAcademicDetails)(student.id, req.body);
        return res.status(201).json({
            success: true,
            data: academic
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addAcademicDetails = addAcademicDetails;
