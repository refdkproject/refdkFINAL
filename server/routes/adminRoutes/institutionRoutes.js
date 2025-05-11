import express from "express";
import { protect, checkRole } from "../../middleware/authMiddleware.js";
import { getAllInstitutions } from "../../controllers/institutionEngagementController.js";

const router = express.Router();

/* Institution Routes */
router.get("/", protect, checkRole(["admin", "charity_admin"]), getAllInstitutions);

export default router;
