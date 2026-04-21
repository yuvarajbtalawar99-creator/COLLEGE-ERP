import { Router } from "express";
import {
  createAdmission,
  finalSubmit,
  getMyAdmission
} from "../controllers/student.controller";
import {
  checkAadhaar,
  checkCetNumber,
  checkEmail
} from "../controllers/validation.controller";

import { verifyToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();

// Validation routes (Public or Student access)
router.post("/check-aadhaar", checkAadhaar);
router.post("/check-cet", checkCetNumber);
router.post("/check-email", checkEmail);

router.post(
  "/create",
  verifyToken,
  authorizeRoles("STUDENT"),
  createAdmission
);

router.get(
  "/my-admission",
  verifyToken,
  authorizeRoles("STUDENT"),
  getMyAdmission
);

router.post(
  "/submit",
  verifyToken,
  authorizeRoles("STUDENT"),
  finalSubmit
);

export default router;