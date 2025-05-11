import asyncHandler from '../middleware/asyncHandler.js';
import { UPLOAD_TYPES } from '../middleware/uploadMiddleware.js';
import WishList from '../models/wishlistModel.js';
import { deleteFile, getMediaUrl } from "../utils/fileUtils.js";
import { CloudinaryService } from '../config/cloudinary.js';
const cloudinaryService = new CloudinaryService();


// @desc    Create a New Wishlist Item
// @route   POST /api/wishlist
// @access  Admin
export const createWishListItem = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, mediaUrl, tags } = req.body;

    // const fileUrl = req.file.filename
    //   ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req.file.filename)
    //   : null;

    let mediaUpload = null;
    if (req.file) {
        mediaUpload = await cloudinaryService.uploadImage(req.file.path);
    }
    const fileUrl = mediaUpload?.secure_url || null; // Use the URL from the upload response


    const wishlistItem = await WishList.create({
      title,
      description,
      mediaUrl: fileUrl,
      createdBy: req.user.institution,
      tags,
    });

    deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename), req.user._id, UPLOAD_TYPES.EVENT_PIC);
        
    res.status(201).json({
      success: true,
      message: 'Wishlist item created successfully!',
      data: wishlistItem,
    });
  } catch (error) {
    console.error('Error creating wishlist item:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get All Wishlist Items
// @route   GET /api/wishlist
// @access  Public
export const getWishListItems = asyncHandler(async (req, res) => {
  try {
    const wishlistItems = await WishList.find();
    res.status(200).json({
      success: true,
      message: 'Wishlist items fetched successfully!',
      data: wishlistItems,
    });
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get a Single Wishlist Item by ID
// @route   GET /api/wishlist/:id
// @access  Public
export const getWishListItemById = asyncHandler(async (req, res) => {
  try {
    const wishlistItem = await WishList.findById(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Wishlist item fetched successfully!',
      data: wishlistItem,
    });
  } catch (error) {
    console.error('Error fetching wishlist item:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get Wishlist Items by Organization ID
// @route   GET /api/wishlist/org/:id
// @access  Public
export const getWishListItemsByOrgId = asyncHandler(async (req, res) => {
  try {
    const wishlistItems = await WishList.find({ createdBy: req.params.id });

    if (wishlistItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No wishlist items found for this organization',
        data: [],
      });
    }

    if (!wishlistItems) {
      return res.status(404).json({
        success: false,
        message: 'No wishlist items found for this organization',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist items fetched successfully!',
      data: wishlistItems,
    });
  } catch (error) {
    console.error('Error fetching wishlist items by organization ID:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update a Wishlist Item by ID
// @route   PUT /api/wishlist/:id
// @access  Admin
export const updateWishListItem = asyncHandler(async (req, res) => {
  try {
    const { title, description, createdBy, tags } = req.body;

    // const fileUrl = req.file.filename
    //   ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req.file.filename)
    //   : null;

    let mediaUpload = null;
    if (req.file) {
        mediaUpload = await cloudinaryService.uploadImage(req.file.path);
    }
    const fileUrl = mediaUpload?.secure_url || null; // Use the URL from the upload response

    const wishlist = await WishList.findById(req.params.id);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }

    wishlist.title = title || wishlist.title;
    wishlist.description = description || wishlist.description;
    wishlist.mediaUrl = fileUrl || wishlist.mediaUrl;
    wishlist.createdBy = createdBy || wishlist.createdBy;
    wishlist.tags = tags || wishlist.tags;

    const updatedTraining = await wishlist.save();

    if (!updatedTraining) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update wishlist item',
      });
    }

    // TODO: DELETE OLD VIDEO FILE IF EXISTS
    deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename), req.user._id, UPLOAD_TYPES.EVENT_PIC);
        

    res.status(200).json({
      success: true,
      message: 'Wishlist item updated successfully!',
      data: updatedTraining,
    });
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete a Wishlist Item by ID
// @route   DELETE /api/wishlist/:id
// @access  Admin
export const deleteWishListItem = asyncHandler(async (req, res) => {
  try {
    const wishlistItem = await WishList.findByIdAndDelete(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Wishlist item deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
