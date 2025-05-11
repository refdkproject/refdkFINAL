import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
    },
    contact: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    role: {
      type: String,
      enum: ["volunteer", "charity_admin", "admin"], // Added "admin"
      required: true,
      default: "volunteer",
    },
    skills: {
      type: [String],
     default: [],
    },
    availability: {
      type: String,
    },
    areasOfInterest: {
      type: [String],
      default: [],
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    totallikes: {
      type: Number,
      default: 0,
    },

    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: function () {
        return this.role === "charity_admin"
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
)

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password)
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    console.error("Password hashing error:", error)
    next(error)
  }
})

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

const User = mongoose.model("User", userSchema)

export default User
