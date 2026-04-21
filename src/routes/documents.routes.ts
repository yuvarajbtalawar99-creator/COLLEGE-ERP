import { Router } from "express";
import { uploadDocuments } from "../controllers/documents.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/upload",
  verifyToken,
  upload.fields([
    { name: "sslcMarkscard", maxCount: 1 },
    { name: "pucMarkscard", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "incomeCertificate", maxCount: 1 },
    { name: "transferCertificate", maxCount: 1 },
    { name: "migrationCertificate", maxCount: 1 },
    { name: "studyCertificate", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 }
  ]),
  uploadDocuments
);

export default router;