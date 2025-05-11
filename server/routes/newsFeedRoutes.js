import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { uploadPostPic } from "../middleware/uploadMiddleware.js"

import { createNewsFeed, deletePost, getAllNewsFeed, updateLikes } from "../controllers/newsFeedController.js"

const router = express.Router()

router.get("/", protect, getAllNewsFeed)
router.post("/", protect, uploadPostPic, createNewsFeed)
router.put("/likes/:id", protect, updateLikes)
router.delete("/:id", protect, deletePost)

export default router
