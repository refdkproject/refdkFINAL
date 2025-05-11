import mongoose from "mongoose";

const institutionEngagementSchema = new mongoose.Schema(
    {
        volunteerName: {
            type: String,
            required: [true, "Volunteer name is required"],
        },
        description: {
            type: String,
            required: true,
            maxlength: 500, // Optional: limit the length of the description
        },
        eventName: {
            type: String,
        },
        assignedBy: {
            type: String,
        },
        volunteerPic: {
            type: String,
        },
        institution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institution",
        },
    },
    { timestamps: true }
);

const InstitutionEngagement = mongoose.model("InstitutionEngagement", institutionEngagementSchema);
export default InstitutionEngagement;
