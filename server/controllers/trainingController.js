import asyncHandler from '../middleware/asyncHandler.js';
import { UPLOAD_TYPES } from '../middleware/uploadMiddleware.js';
import Training from '../models/trainingModel.js';
import { deleteFile, getMediaUrl } from "../utils/fileUtils.js";
import { CloudinaryService } from '../config/cloudinary.js';
const cloudinaryService = new CloudinaryService();

// @desc    Create a New Training
// @route   POST /api/trainings
// @access  Admin
export const createTraining = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, tags } = req.body;

    // const fileUrl = req.file.filename ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.VIDEO, req.file.filename) : null;
    let mediaUpload = null;
    if (req.file) {
        mediaUpload = await cloudinaryService.uploadImage(req.file.path);
        if (!mediaUpload || !mediaUpload.secure_url) {
          console.error("Error uploading file to Cloudinary:", mediaUpload?.message || "Unknown error");
          return res.status(400).json({
              success: false,
              message: mediaUpload?.message || "Failed to upload file",
          });
      }
    }
    const fileUrl = mediaUpload?.secure_url || null; // Use the URL from the upload response

    const training = await Training.create({
      title,
      description,
      mediaUrl: fileUrl,
      createdBy: req.user.institution,
      tags,
    });

    if (!training) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create training',
      });
    }

    deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.VIDEO, req?.file?.filename), req.user._id, UPLOAD_TYPES.VIDEO);
        
    res.status(201).json({
      success: true,
      message: 'Training created successfully!',
      data: training,
    });
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get All Trainings
// @route   GET /api/trainings
// @access  Public
export const getTrainings = asyncHandler(async (req, res) => {
  try {
    const trainings = await Training.find();
    res.status(200).json({
      success: true,
      message: 'Trainings fetched successfully!',
      data: trainings,
    });
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get a Single Training by ID
// @route   GET /api/trainings/:id
// @access  Public
export const getTrainingById = asyncHandler(async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Training fetched successfully!',
      data: training,
    });
  } catch (error) {
    console.error('Error fetching training:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get a Single Training by ID
// @route   GET /api/trainings/:id
// @access  Public
export const getTrainingByOrgId = asyncHandler(async (req, res) => {
  try {
    const trainings = await Training.find({ createdBy: req.params.id });
    if (trainings.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No trainings found for this organization',
        data: [],
      });
    }

    if (!trainings) {
      return res.status(404).json({
        success: false,
        message: 'No trainings found for this organization',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Trainings fetched successfully!',
      data: trainings,
    });
  } catch (error) {
    console.error('Error fetching trainings by organization ID:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Update a Training by ID
// @route   PUT /api/trainings/:id
// @access  Admin
export const updateTraining = asyncHandler(async (req, res) => {
  try {
    const { title, description, createdBy, tags } = req.body;
    // const fileUrl = req?.file?.filename ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.VIDEO, req?.file?.filename) : null;
    let mediaUpload = null;
    if (req.file) {
        mediaUpload = await cloudinaryService.uploadImage(req.file.path);
        if (!mediaUpload || !mediaUpload.secure_url) {
            console.error("Error uploading file to Cloudinary:", mediaUpload?.message || "Unknown error");
            return res.status(400).json({
                success: false,
                message: mediaUpload?.message || "Failed to upload file",
            });
        }
    }

    const fileUrl = mediaUpload?.secure_url || null; // Use the URL from the upload response

    const training = await Training.findById(req.params.id);

    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }

    training.title = title || training.title;
    training.description = description || training.description;
    training.mediaUrl = fileUrl || training.mediaUrl;
    training.createdBy = createdBy || training.createdBy;
    training.tags = tags || training.tags;

    const updatedTraining = await training.save();

    if (!updatedTraining) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update training',
      });
    }

    // TODO: DELETE OLD VIDEO FILE IF EXISTS
    deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.VIDEO, req?.file?.filename), req.user._id, UPLOAD_TYPES.VIDEO);
        
    res.status(200).json({
      success: true,
      message: 'Training updated successfully!',
      data: updatedTraining,
    });
  } catch (error) {
    console.error('Error updating training:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Delete a Training by ID
// @route   DELETE /api/trainings/:id
// @access  Admin
export const deleteTraining = asyncHandler(async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({
        success: false,
        message: 'Training not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Training deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
