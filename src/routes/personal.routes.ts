import { Router } from "express";
import { addPersonalDetails } from "../controllers/personal.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", verifyToken, addPersonalDetails);

export default router;