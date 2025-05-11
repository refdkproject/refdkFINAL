import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import createDefaultAdmin from '../utils/createDefaultAdmin.js';

// MongoDB connection URI
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Create the default admin user after successful connection
    await createDefaultAdmin();

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  } 
};

export default connectDB;
