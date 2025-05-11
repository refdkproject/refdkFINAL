import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
    },
    description: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
      default: "skilled",
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
    },
    numberOfVolunteer: {
      type: Number
    },
    eventPic: {
        type: String,
      },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  { timestamps: true }
)

const Event = mongoose.model("Event", eventSchema)
export default Event
