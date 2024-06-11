import { Router } from 'express';
import Event from '../models/Event';
import mongoose from 'mongoose';

const router = Router();

router.get('/events', async (req, res) => {
    try {
        const events = await Event.find({});
        const clonedEvents = events.map(event => ({
            ...event.toObject(),  // Convert to plain object
            id: event._id,  // Add id property
        }));
        res.json(clonedEvents);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json({ ...savedEvent.toObject(), id: savedEvent._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).send('Invalid ObjectId');
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true, runValidators: true });
        if (!updatedEvent) return res.status(404).send('Event not found');
        res.json({ ...updatedEvent.toObject(), id: updatedEvent._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).send('Invalid ObjectId');
        }
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) return res.status(404).send('Event not found');
        res.json({ ...deletedEvent.toObject(), id: deletedEvent._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
