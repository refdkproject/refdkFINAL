import express from "express";
import { protect, checkRole } from "../../middleware/authMiddleware.js";
import { uploadEventPic, uploadVideo } from "../../middleware/uploadMiddleware.js";
import { createWishListItem, deleteWishListItem, getWishListItemById, getWishListItemsByOrgId, updateWishListItem } from "../../controllers/wishlistController.js";

const router = express.Router();

/* Event Routes */
router.get("/:id", protect, checkRole(["admin", "charity_admin"]), getWishListItemsByOrgId);

router.get("/single/:id", protect, checkRole(["admin", "charity_admin"]), getWishListItemById);

router.post("/", protect, checkRole(["admin", "charity_admin"]), uploadEventPic, createWishListItem);

router.put("/:id", protect, checkRole(["admin", "charity_admin"]), uploadEventPic, updateWishListItem);

router.delete("/:id", protect, checkRole(["admin", "charity_admin"]), deleteWishListItem);

export default router;
