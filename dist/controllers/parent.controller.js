"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParentDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const parent_service_1 = require("../services/parent.service");
const addParentDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        const student = await prisma_1.default.student.findUnique({
            where: { userId }
        });
        if (!student) {
            return res.status(404).json({ message: "Admission not found" });
        }
        const parent = await (0, parent_service_1.saveParentDetails)(student.id, req.body);
        res.status(201).json({
            success: true,
            data: parent
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addParentDetails = addParentDetails;
