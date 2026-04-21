"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistricts = exports.addAddressDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const address_service_1 = require("../services/address.service");
const addAddressDetails = async (req, res) => {
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
        const address = await (0, address_service_1.saveAddressDetails)(student.id, req.body);
        return res.status(201).json({
            success: true,
            data: address
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.addAddressDetails = addAddressDetails;
const getDistricts = async (req, res) => {
    try {
        const districts = await prisma_1.default.district.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return res.status(200).json({
            success: true,
            data: districts
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch districts"
        });
    }
};
exports.getDistricts = getDistricts;
