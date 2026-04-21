"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
/* =========================
   ADMIN DASHBOARD
========================= */
router.get("/dashboard", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.getDashboardStats);
/* =========================
   GET STUDENTS (FILTERABLE)
========================= */
router.get("/students", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.getStudents);
/* =========================
   STUDENT FULL PROFILE
========================= */
router.get("/student/:id", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.getStudentById);
/* =========================
   UPDATE APPLICATION STATUS
========================= */
router.patch("/student/:id/status", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.updateStudentStatus);
/* =========================
   GENERATE TEMP COLLEGE ID
========================= */
router.post("/student/:id/generate-tempid", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.generateTempCollegeId);
/* =========================
   ASSIGN VTU USN
========================= */
router.post("/student/:id/assign-usn", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.assignUSN);
/* =========================
   DOCUMENT VERIFICATION
========================= */
router.post("/student/:id/verify-documents", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("ADMISSION_OFFICER"), admin_controller_1.verifyDocuments);
exports.default = router;
