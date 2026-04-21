import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

import {
  getDashboardStats,
  getStudents,
  getStudentById,
  updateStudentStatus,
  generateTempCollegeId,
  assignUSN,
  startReview,
  verifyDocuments,
  approveAdmission,
  rejectApplication,
  updateDocChecks
} from "../controllers/admin.controller";

const router = Router();

/* =========================
   ADMIN DASHBOARD
========================= */
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  getDashboardStats
);

/* =========================
   GET STUDENTS (FILTERABLE)
========================= */
router.get(
  "/students",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  getStudents
);

/* =========================
   STUDENT FULL PROFILE
========================= */
router.get(
  "/student/:id",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  getStudentById
);

/* =========================
   UPDATE APPLICATION STATUS (GENERIC)
========================= */
router.patch(
  "/student/:id/status",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  updateStudentStatus
);

/* =========================
   WORKFLOW: START REVIEW
========================= */
router.post(
  "/student/:id/start-review",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  startReview
);

/* =========================
   WORKFLOW: UPDATE DOC VERIFICATION CHECKS
========================= */
router.patch(
  "/student/:id/doc-checks",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  updateDocChecks
);

/* =========================
   WORKFLOW: VERIFY DOCUMENTS (STATUS CHANGE)
========================= */
router.post(
  "/student/:id/verify-documents",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  verifyDocuments
);

/* =========================
   WORKFLOW: APPROVE ADMISSION
========================= */
router.post(
  "/student/:id/approve",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  approveAdmission
);

/* =========================
   WORKFLOW: REJECT APPLICATION
========================= */
router.post(
  "/student/:id/reject",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  rejectApplication
);

/* =========================
   GENERATE TEMP COLLEGE ID
========================= */
router.post(
  "/student/:id/generate-tempid",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  generateTempCollegeId
);

/* =========================
   ASSIGN VTU USN
========================= */
router.post(
  "/student/:id/assign-usn",
  verifyToken,
  authorizeRoles("ADMISSION_OFFICER"),
  assignUSN
);

export default router;