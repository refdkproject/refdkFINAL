import { UPLOAD_TYPES } from "../middleware/uploadMiddleware.js";
import NewsFeed from "../models/newsFeedModel.js";
import User from "../models/userModel.js";
import { deleteFile, getMediaUrl } from "../utils/fileUtils.js";
import { CloudinaryService } from '../config/cloudinary.js';
const cloudinaryService = new CloudinaryService();


const getAllNewsFeed = async (req, res) => {
    try {

        const newsFeed = await NewsFeed.find().populate('userId', 'name profilePic role').sort({ createdAt: -1 });

        res.status(201).json(newsFeed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chat' });
    }
};

const createNewsFeed = async (req, res) => {
    try {
        const { message } = req.body;
        // const fileUrl = req?.file?.filename ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.POST_PIC, req.file.filename) : null;
        const user = await User.findById(req.user._id);

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

        const newsFeed = await NewsFeed.create({
            message,
            media: fileUrl,
            userId: req.user._id,
        });

        user.totalPosts += 1;
        await user.save();

        const postToSend = await NewsFeed.findById(newsFeed._id).populate('userId', 'name profilePic role').sort({ createdAt: -1 });

        deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.POST_PIC, req?.file?.filename), req.user._id, UPLOAD_TYPES.POST_PIC);
        

        res.status(201).json(postToSend);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
};

const updateLikes = async (req, res) => {
    try {
        const { id } = req.params;

        const newsFeed = await NewsFeed.findById(id);
        const user = await User.findById(req.user._id);
        if (!newsFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likeIndex = newsFeed.likedBy.findIndex(like => like.likedBy.toString() === req.user._id.toString());
        if (likeIndex !== -1) {
        newsFeed.likedBy.splice(likeIndex, 1);
        newsFeed.likes = Math.max(0, newsFeed.likes - 1);
        user.totallikes = Math.max(0, user.totallikes - 1);
        } else {
            newsFeed.likedBy.push({ likedBy: req.user._id });
            newsFeed.likes += 1;
            user.totallikes += 1;
        }
        
        await newsFeed.save();
        await user.save();

        res.status(200).json(newsFeed);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update likes' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const newsFeed = await NewsFeed.findById(id);
        if (!newsFeed) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (newsFeed.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await newsFeed.deleteOne();
        
        const user = await User.findById(req.user._id);
        user.totalPosts = Math.max(0, user.totalPosts - 1);
        await user.save();
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

export {
    createNewsFeed,
    getAllNewsFeed,
    updateLikes,
    deletePost
};