"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const validation_controller_1 = require("../controllers/validation.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
// Validation routes (Public or Student access)
router.post("/check-aadhaar", validation_controller_1.checkAadhaar);
router.post("/check-cet", validation_controller_1.checkCetNumber);
router.post("/check-email", validation_controller_1.checkEmail);
router.post("/create", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), student_controller_1.createAdmission);
router.get("/my-admission", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), student_controller_1.getMyAdmission);
router.post("/submit", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), student_controller_1.finalSubmit);
exports.default = router;
