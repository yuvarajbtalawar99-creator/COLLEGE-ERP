"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (email, mobile, password, role) => {
    const existingUser = await prisma_1.default.user.findFirst({
        where: {
            OR: [{ email }, { mobile }]
        }
    });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            email,
            mobile,
            password: hashedPassword,
            role
        }
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user)
        throw new Error("Invalid credentials");
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { token };
};
exports.loginUser = loginUser;
