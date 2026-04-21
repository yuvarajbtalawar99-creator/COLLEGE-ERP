"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveParentDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const saveParentDetails = async (studentId, data) => {
    const parent = await prisma_1.default.studentparentdetails.upsert({
        where: { studentId },
        update: {
            fatherName: data.fatherName || "",
            motherName: data.motherName || "",
            parentMobile: data.parentMobile || "",
            parentEmail: data.parentEmail || null,
            occupation: data.occupation || null,
            annualIncome: data.annualIncome ? Number(data.annualIncome) : null
        },
        create: {
            studentId,
            fatherName: data.fatherName || "",
            motherName: data.motherName || "",
            parentMobile: data.parentMobile || "",
            parentEmail: data.parentEmail || null,
            occupation: data.occupation || null,
            annualIncome: data.annualIncome ? Number(data.annualIncome) : null
        }
    });
    return parent;
};
exports.saveParentDetails = saveParentDetails;
