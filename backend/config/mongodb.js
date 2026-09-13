import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn("MONGODB_URI is not configured.");
            return;
        }
        mongoose.connection.on("connected", () => {console.log("Database Connected");});
        mongoose.connection.on("error", (error) => {console.error("MongoDB connection error:", error.message);});
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to:", mongoose.connection.host);
        console.log("Database:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;