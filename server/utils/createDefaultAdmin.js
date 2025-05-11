import User from "../models/userModel.js"

const createDefaultAdmin = async () => {
  try {
    // Check if admin user exists
    const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL })

    if (!adminUser) {
      // Create admin user - password will be hashed by the pre-save hook
      const admin = await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE,
        phoneNumber: process.env.ADMIN_PHONE,
      })

      console.log("Default admin user created successfully")
    } else {
      console.log("Admin user already exists")
    }
  } catch (error) {
    console.error("Error creating default admin:", error)
  }
}

export default createDefaultAdmin
