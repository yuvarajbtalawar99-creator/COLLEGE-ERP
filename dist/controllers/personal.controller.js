"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPersonalDetails = void 0;
const personal_service_1 = require("../services/personal.service");
const prisma_1 = __importDefault(require("../config/prisma"));
const addPersonalDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
            where: { userId }
        });
        if (!student) {
            return res.status(404).json({ message: "Admission not found" });
        }
        const personal = await (0, personal_service_1.savePersonalDetails)(student.id, req.body);
        res.status(201).json({
            success: true,
            data: personal
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addPersonalDetails = addPersonalDetails;
