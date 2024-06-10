import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://admin:admin@mygitdb.v0gnkoy.mongodb.net")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    priority: String,
    start: Date,
    end: Date,
});

const Event = mongoose.model('Event', eventSchema);

app.get('/api/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

app.post('/api/events', async (req, res) => {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
});

app.put('/api/events/:id', async (req, res) => {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
});

app.delete('/api/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
