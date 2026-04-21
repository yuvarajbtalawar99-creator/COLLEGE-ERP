"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/address.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/add", auth_middleware_1.verifyToken, address_controller_1.addAddressDetails);
router.get("/districts", auth_middleware_1.verifyToken, address_controller_1.getDistricts);
exports.default = router;
