import express from "express";
import { protect, checkRole } from "../../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
} from "../../controllers/eventController.js";
import { createInstitutionEngagement, deleteInstitutionEngagement, getAllInstitutionEngagements, getSingleInstitutionEngagement, updateInstitutionEngagement } from "../../controllers/institutionEngagementController.js";
import { uploadEventPic, uploadVolunteerPic } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

/* Event Routes */
router.get("/", protect, checkRole(["admin", "charity_admin"]), getAllEvents);

router.get("/:id", protect, checkRole(["admin", "charity_admin"]), getSingleEvent);

router.post("/", protect, checkRole(["admin", "charity_admin"]), uploadEventPic, createEvent);

router.put("/:id", protect, checkRole(["admin", "charity_admin"]), uploadEventPic, updateEvent);

router.delete("/:id", protect, checkRole(["admin", "charity_admin"]), deleteEvent);

export default router;
