"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
// Exact endpoints requested by user
router.get("/status", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), application_controller_1.getApplicationStatus);
router.get("/full-details", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), application_controller_1.getFullDetails);
router.get("/download-pdf", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), application_controller_1.downloadPDF);
router.post("/step-complete", auth_middleware_1.verifyToken, (0, authorize_middleware_1.authorizeRoles)("STUDENT"), (req, res) => {
    // Since my system derives status from existing data, 
    // this is successfully complete as long as the student data is valid.
    // The frontend calls this after successful data save.
    res.json({ success: true, message: "Step status synchronized successfully" });
});
exports.default = router;
