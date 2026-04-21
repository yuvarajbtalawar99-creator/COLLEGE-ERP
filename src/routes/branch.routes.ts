import { Router } from "express";
import { getBranches } from "../controllers/branch.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getBranches);
router.get("/", verifyToken, getBranches);

export default router;