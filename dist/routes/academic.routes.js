"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academic_controller_1 = require("../controllers/academic.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.verifyToken, academic_controller_1.addAcademicDetails);
exports.default = router;
