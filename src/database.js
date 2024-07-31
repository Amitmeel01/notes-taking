import { config } from 'dotenv';
import mongoose from 'mongoose';

config(); // Load environment variables

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Adjust if needed
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
    }
};

export default connectDb;
