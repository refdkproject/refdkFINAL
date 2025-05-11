import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [false, "Training title is required"],
        },
        description: {
            type: String,
            required: [false, "Training description is required"],
        },
        mediaUrl: {
            type: String,
            required: [false, "Media is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institution",
            required: true,
        },
        tags: {
            type: String, // Tags like "elderly", "disabled", etc.
        },
    },
    { timestamps: true }
);

const Training = mongoose.model("Training", trainingSchema);
export default Training;
