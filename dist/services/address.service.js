"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAddressDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const saveAddressDetails = async (studentId, data) => {
    const address = await prisma_1.default.studentaddress.upsert({
        where: { studentId },
        update: {
            Address: data.Address || "",
            City: data.City || "",
            Taluk: data.Taluk || "",
            DistrictId: Number(data.DistrictId) || 0,
            Pincode: data.Pincode || "",
            permanentAddress: data.permanentAddress || "",
            permanentCity: data.permanentCity || "",
            permanentTaluk: data.permanentTaluk || "",
            permanentDistrictId: Number(data.permanentDistrictId) || 0,
            permanentPincode: data.permanentPincode || ""
        },
        create: {
            studentId,
            Address: data.Address || "",
            City: data.City || "",
            Taluk: data.Taluk || "",
            DistrictId: Number(data.DistrictId) || 0,
            Pincode: data.Pincode || "",
            permanentAddress: data.permanentAddress || "",
            permanentCity: data.permanentCity || "",
            permanentTaluk: data.permanentTaluk || "",
            permanentDistrictId: Number(data.permanentDistrictId) || 0,
            permanentPincode: data.permanentPincode || ""
        }
    });
    return address;
};
exports.saveAddressDetails = saveAddressDetails;
