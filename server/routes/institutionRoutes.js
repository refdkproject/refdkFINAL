import express from "express"
import { protect, checkRole } from "../middleware/authMiddleware.js"
import { getAllInstitutions } from "../controllers/institutionEngagementController.js"

const router = express.Router()

router.get(
  "/",
  protect,
  getAllInstitutions
)

// router.put(
//   "/my-institution",
//   protect,
//   checkRole(["charity_admin"]),
//   async (req, res) => {
//     const updated = await Institution.findByIdAndUpdate(
//       req.user.institution,
//       req.body,
//       { new: true }
//     )
//     res.json(updated)
//   }
// )

export default router
