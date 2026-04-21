"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documents_controller_1 = require("../controllers/documents.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.post("/upload", auth_middleware_1.verifyToken, upload_middleware_1.upload.fields([
    { name: "sslcMarkscard", maxCount: 1 },
    { name: "pucMarkscard", maxCount: 1 },
    { name: "casteCertificate", maxCount: 1 },
    { name: "incomeCertificate", maxCount: 1 },
    { name: "transferCertificate", maxCount: 1 },
    { name: "migrationCertificate", maxCount: 1 },
    { name: "studyCertificate", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 }
]), documents_controller_1.uploadDocuments);
exports.default = router;
