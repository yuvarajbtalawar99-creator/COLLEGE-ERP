"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePersonalDetails = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const savePersonalDetails = async (studentId, data) => {
    const student = await prisma_1.default.student.findUnique({
        where: { id: studentId }
    });
    if (!student) {
        throw new Error("Admission not found");
    }
    if (student.status !== "REGISTERED" &&
        student.status !== "CORRECTION_REQUIRED") {
        throw new Error("Editing not allowed after submission");
    }
    const parsedDob = data.dateOfBirth ? new Date(data.dateOfBirth) : new Date();
    if (isNaN(parsedDob.getTime())) {
        throw new Error("Invalid value for Date of Birth. Expected a valid date.");
    }
    const personal = await prisma_1.default.studentpersonaldetails.upsert({
        where: { studentId },
        update: {
            fullName: data.fullName || "",
            gender: data.gender,
            dateOfBirth: parsedDob,
            category: data.category || "",
            religion: data.religion || "",
            nationality: data.nationality || "Indian",
            areaType: data.areaType || "URBAN",
            studiedInKarnataka: !!data.studiedInKarnataka
        },
        create: {
            studentId,
            fullName: data.fullName || "",
            gender: data.gender,
            dateOfBirth: parsedDob,
            category: data.category || "",
            religion: data.religion || "",
            nationality: data.nationality || "Indian",
            areaType: data.areaType || "URBAN",
            studiedInKarnataka: !!data.studiedInKarnataka
        }
    });
    return personal;
};
exports.savePersonalDetails = savePersonalDetails;
