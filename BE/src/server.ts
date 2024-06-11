import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import eventRoutes from './routes/eventRoutes';

dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api', eventRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
