import { Router } from "express";
import { me, syncUser } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sync", syncUser);
router.get("/me", verifyToken, me);

export default router;