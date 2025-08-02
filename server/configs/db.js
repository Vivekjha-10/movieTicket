import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    throw error; // taaki agar DB connect nahi hua to pata chale
  }
};

export default connectDB;
