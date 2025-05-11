import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
            required: false,
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

const WishList = mongoose.model("WishList", wishlistSchema);
export default WishList;
