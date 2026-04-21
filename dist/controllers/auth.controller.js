"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    try {
        const { email, mobile, password, role } = req.body;
        const user = await (0, auth_service_1.registerUser)(email, mobile, password, role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            token: result.token
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.login = login;
