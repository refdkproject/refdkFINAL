import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { addVolunteerToEvent, getAllEvents, getSingleEvent, getUserVolunteerEvents } from "../controllers/eventController.js"

const router = express.Router()

router.route("/").get(protect, getAllEvents)
router.post("/:eventId/volunteer", protect, addVolunteerToEvent)
router.get("/joined", protect, getUserVolunteerEvents)
router.get("/:id", protect, getSingleEvent)

export default router
