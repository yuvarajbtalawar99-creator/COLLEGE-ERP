"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranches = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getBranches = async (req, res) => {
    try {
        const branches = await prisma_1.default.branch.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return res.status(200).json({
            success: true,
            data: branches
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch branches"
        });
    }
};
exports.getBranches = getBranches;
