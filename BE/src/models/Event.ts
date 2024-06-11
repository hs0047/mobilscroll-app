import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    description: { type: String, maxlength: 100 },
    priority: { type: String },
    color: { type: String }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
