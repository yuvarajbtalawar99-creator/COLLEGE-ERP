"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash("admin123", 10);
    await prisma_1.default.user.create({
        data: {
            email: "officer@gmail.com",
            mobile: "9876543210", // must be unique
            password: hashedPassword,
            role: "ADMISSION_OFFICER"
        }
    });
    console.log("Admission Officer created successfully");
}
main()
    .catch(console.error)
    .finally(() => prisma_1.default.$disconnect());
