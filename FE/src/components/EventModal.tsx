import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { addEvent, updateEvent } from '../features/events/eventsSlice';
import axios from '../api/axios';

interface EventModalProps {
    open: boolean;
    handleClose: () => void;
    event?: any;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EventModal: React.FC<EventModalProps> = ({ open, handleClose, event }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStart(event.start);
            setEnd(event.end);
            setDescription(event.description);
            setPriority(event.priority);
            setColor(event.color);
        }
    }, [event]);

    const handleSubmit = async () => {
        const newEvent = { title, start, end, description, priority, color };
        if (event) {
            // Update event
            const response = await axios.put(`/events/${event._id}`, newEvent);
            dispatch(updateEvent(response.data));
        } else {
            // Create event
            const response = await axios.post('/events', newEvent);
            dispatch(addEvent(response.data));
        }
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    {event ? 'Edit Event' : 'Add Event'}
                </Typography>
                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Start"
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="End"
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    margin="normal"
                />
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {event ? 'Update' : 'Add'}
                </Button>
            </Box>
        </Modal>
    );
};

export default EventModal;
