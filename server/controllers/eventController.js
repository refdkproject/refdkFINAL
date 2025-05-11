import asyncHandler from "../middleware/asyncHandler.js"
import Institution from "../models/institutionModel.js";
import Event from "../models/eventModel.js";
import Chat from "../models/chatModel.js";
import mongoose from "mongoose";
import { deleteFile, getMediaUrl } from "../utils/fileUtils.js";
import { CloudinaryService } from '../config/cloudinary.js';
const cloudinaryService = new CloudinaryService();
import { UPLOAD_TYPES } from "../middleware/uploadMiddleware.js";


// @desc    Get All Events
// @route   GET /api/events
// @access  Admin or Charity Admin, Public (with role check)
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        // Check the user's role
        if (req.user.role !== 'volunteer') {
            // Fetch institution with its associated events for Admin or Charity Admin
            const institution = await Institution.findById(req.user.institution).populate("events");

            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: "Institution not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Events fetched successfully!",
                data: institution.events,
            });
        } else {
            // If the user is a volunteer, get all events in the table
            const events = await Event.find();

            // Exclude the volunteers field from the event response
            // const eventData = events.map(event => {
            //     const { volunteers, ...eventWithoutVolunteers } = event.toObject();
            //     return eventWithoutVolunteers;
            // });
            
            return res.status(200).json({
                success: true,
                message: "All events fetched successfully!",
                data: events,
            });
        }

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Create a New Event
// @route   POST /api/event
// @access  Admin or Charity Admin
const createEvent = asyncHandler(async (req, res) => {
    try {
        const { name, description, region, city, skillLevel, startDate, endDate, location, numberOfVolunteer } = req.body;

        // Check if the user has an institution assigned
        const institution = await Institution.findById(req.user.institution);

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: "Institution not found",
            });
        }
        let mediaUpload = null;
        // const fileUrl = req?.file?.filename ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename) : null;
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

        // Create the new event
        const newEvent = new Event({
            name,
            description,
            region,
            city,
            skillLevel,
            startDate,
            endDate,
            location,
            numberOfVolunteer,
            eventPic: fileUrl,
        });

        // Save the event
        const savedEvent = await newEvent.save();
        
        deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename), req.user._id, UPLOAD_TYPES.EVENT_PIC);
        
        // Link event to the institution
        institution.events.push(savedEvent._id);
        await institution.save();

        const chat = new Chat({
            eventId: savedEvent._id,
        })

        await chat.save();

        res.status(201).json({
            success: true,
            message: "Event created successfully!",
            data: savedEvent,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Update an Event
// @route   PUT /api/event/:eventId
// @access  Admin or Charity Admin
const updateEvent = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        let mediaUpload = null;
        // const fileUrl = req?.file?.filename ? getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename) : null;
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

        if (fileUrl && fileUrl !== "" && fileUrl !== "undefined" && fileUrl !== null) {
          updates.eventPic = fileUrl; // Update image path if a new file is uploaded
        }
        
        deleteFile(getMediaUrl(req, req.user._id, UPLOAD_TYPES.EVENT_PIC, req?.file?.filename), req.user._id, UPLOAD_TYPES.EVENT_PIC);
        
        // Find the event
        let event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if the event belongs to the user's institution
        const institution = await Institution.findOne({ events: id });

        if (!institution || institution._id.toString() !== req.user.institution.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this event",
            });
        }

        // Update the event
        event = await Event.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({
            success: true,
            message: "Event updated successfully!",
            data: event,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Delete an Event
// @route   DELETE /api/event/:eventId
// @access  Admin or Charity Admin
const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if the event belongs to the user's institution
        const institution = await Institution.findOne({ events: id });

        if (!institution || institution._id.toString() !== req.user.institution.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this event",
            });
        }

        // Remove the event from the institution's events array
        institution.events = institution.events.filter(
            (id) => id.toString() !== id
        );
        await institution.save();

        // Delete the event
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Add User to Event Volunteer List
// @route   POST /api/event/:eventId/volunteer
// @access  Admin or Charity Admin
const addVolunteerToEvent = asyncHandler(async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id; // Assuming the user ID is in req.user

        // Find the event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Check if the user is already a volunteer for the event
        if (event.volunteers.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "User is already a volunteer for this event",
            });
        }

        // Add user to the volunteers list
        event.volunteers.push(userId);
        await event.save();

        res.status(200).json({
            success: true,
            message: "User added to volunteer list successfully!",
            data: event,
        });
    } catch (error) {
        console.error("Error adding volunteer:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Get Single Event
// @route   GET /api/event/:eventId
// @access  Admin or Charity Admin, Public (with role check)
const getSingleEvent = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        // Check the user's role
        if (req.user.role !== 'volunteer') {
            // Fetch institution with its associated events for Admin or Charity Admin
            const institution = await Institution.findById(req.user.institution).populate("events");

            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: "Institution not found",
                });
            }

            // Find the event in the institution's events
            const event = institution.events.find(event => event._id.toString() === id);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found in institution",
                });
            }

            // get Voluteers details from the users using populate in event volunteers field
            await event.populate("volunteers", "name email phoneNumber role institution");
            
            return res.status(200).json({
                success: true,
                message: "Event fetched successfully!",
                data: event,
            });
        } else {
            // If the user is a volunteer, get the event directly from the Event model
            console.log(id);
            const event = await Event.findById({_id: id});

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found",
                });
            }

            // Exclude the volunteers field from the event response
            // const { volunteers, ...eventData } = event.toObject();

            return res.status(200).json({
                success: true,
                message: "Event fetched successfully!",
                data: event,
            });
        }
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @desc    Get All Events for a User Where They are a Volunteer
// @route   GET /api/event/joined
// @access  User (must be logged in)
const getUserVolunteerEvents = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is in req.user

        // Find all events where the user is in the volunteers list
        const events = await Event.find({ volunteers: userId });

        if (!events || events.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No events found for this user.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Events fetched successfully!",
            data: events,
        });
    } catch (error) {
        console.error("Error fetching user's volunteer events:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    addVolunteerToEvent,
    getSingleEvent,
    getUserVolunteerEvents
}
  