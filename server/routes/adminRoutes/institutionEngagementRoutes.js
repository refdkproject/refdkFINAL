import express from "express";
import { protect, checkRole } from "../../middleware/authMiddleware.js";
import { createInstitutionEngagement, deleteInstitutionEngagement, getAllInstitutionEngagements, getSingleInstitutionEngagement, updateInstitutionEngagement } from "../../controllers/institutionEngagementController.js";
import { uploadEventPic, uploadVolunteerPic } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

/* Institution Engagement Routes */
router.get("/", protect, checkRole(["admin", "charity_admin"]), getAllInstitutionEngagements);

router.get("/:id", protect, checkRole(["admin", "charity_admin"]), getSingleInstitutionEngagement);

router.post("/", protect, checkRole(["admin", "charity_admin"]), uploadVolunteerPic, createInstitutionEngagement);

router.put("/:id", protect, checkRole(["admin", "charity_admin"]), uploadVolunteerPic, updateInstitutionEngagement);

router.delete("/:id", protect, checkRole(["admin", "charity_admin"]), deleteInstitutionEngagement);

export default router;
