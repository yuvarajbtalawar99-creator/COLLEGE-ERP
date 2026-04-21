import { Router } from "express";
import { addParentDetails } from "../controllers/parent.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", verifyToken, addParentDetails);

export default router;