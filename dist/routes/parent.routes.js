"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parent_controller_1 = require("../controllers/parent.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.verifyToken, parent_controller_1.addParentDetails);
exports.default = router;
