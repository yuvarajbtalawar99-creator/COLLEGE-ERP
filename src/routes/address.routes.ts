import { Router } from "express";
import { addAddressDetails, getDistricts } from "../controllers/address.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", verifyToken, addAddressDetails);
router.get("/districts", verifyToken, getDistricts);

export default router;