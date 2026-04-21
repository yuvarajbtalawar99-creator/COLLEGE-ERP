"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocuments = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const documents_service_1 = require("../services/documents.service");
const uploadDocuments = async (req, res) => {
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
        const documents = await (0, documents_service_1.saveDocuments)(student.id, req.files);
        return res.status(201).json({
            success: true,
            data: documents
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.uploadDocuments = uploadDocuments;
