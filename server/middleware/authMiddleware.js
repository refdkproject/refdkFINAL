import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import User from "../models/userModel.js"

// Protect routes - User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  if (!req?.headers?.authorization) {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
  const [tokenType, token] = req?.headers?.authorization?.split(" ")
  if (tokenType === "Bearer" && token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userID).select("-password")
      next()
    } catch (error) {
      res.status(401)
      throw new Error("Not authorized, token failed")
    }
  } else {
    res.status(401)
    throw new Error("Not authorized, no token")
  }
})

// Admin middleware
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as admin")
  }
})

// Charity admin middleware
const charityAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "charity_admin") {
    next()
  } else {
    res.status(401)
    throw new Error("Not authorized as charity admin")
  }
})

export const checkRole = (roles) => (req, res, next) => {
  if (roles.length > 0 && !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Unauthorized role access" })
  }
  next()
}

export { protect, admin, charityAdmin }
