"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branch_controller_1 = require("../controllers/branch.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", branch_controller_1.getBranches);
router.get("/", auth_middleware_1.verifyToken, branch_controller_1.getBranches);
exports.default = router;
