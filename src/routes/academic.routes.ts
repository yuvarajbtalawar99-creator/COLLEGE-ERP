import { Router } from "express";
import { addAcademicDetails } from "../controllers/academic.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", verifyToken, addAcademicDetails);

export default router;