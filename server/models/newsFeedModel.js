import mongoose from "mongoose"

const newsFeedSchema = new mongoose.Schema(
  {    
    message: {
      type: String,
    },
    media: {
        type: String,
      },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [
        {
          likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
  },
  { timestamps: true }
)

const NewsFeed = mongoose.model("NewsFeed", newsFeedSchema)
export default NewsFeed
