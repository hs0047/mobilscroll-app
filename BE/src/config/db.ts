import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('MongoDB connected');
    } catch (error) {
        if (error instanceof Error) {
            console.error('MongoDB connection failed:', error.message);
        } else {
            console.error('MongoDB connection failed:', error);
        }
        process.exit(1);
    }
};

export default connectDB;
