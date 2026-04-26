import { Router } from "express";
import { getBranches } from "../controllers/branch.controller";

const router = Router();

// Branches are public master data needed on login-protected and pre-auth screens.
router.get("/", getBranches);

export default router;