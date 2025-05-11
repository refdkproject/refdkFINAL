import mongoose from "mongoose"

const chatSchema = new mongoose.Schema(
  {
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    messages: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
          },
          user: {
            type: String,
          },
          senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          message: {
            type: String,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    }
  },
  { timestamps: true }
)

const Chat = mongoose.model("Chat", chatSchema)
export default Chat
