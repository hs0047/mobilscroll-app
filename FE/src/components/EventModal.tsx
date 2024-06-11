import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box, TextField, Button, Typography, MenuItem, Select } from '@mui/material';
import { SketchPicker } from 'react-color';
import { addEvent, updateEvent, deleteEvent } from '../features/events/eventsSlice';
import axios from '../api/axios';

interface EventModalProps {
    open: boolean;
    handleClose: () => void;
    event?: any;
    handleDelete: (eventId: string) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '80vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EventModal: React.FC<EventModalProps> = ({ open, handleClose, event, handleDelete }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [color, setColor] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

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
        if (event?._id) {
            const response = await axios.put(`/events/${event._id}`, newEvent);
            dispatch(updateEvent(response.data));
        } else {
            const response = await axios.post('/events', newEvent);
            dispatch(addEvent(response.data));
        }
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" gutterBottom>
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
                <Select
                    fullWidth
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as string)}
                    margin="none"
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={2}
                >
                    <Box display="flex" alignItems="center">
                        <Box
                            width={24}
                            height={24}
                            bgcolor={color}
                            border="1px solid #000"
                            mr={1}
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            style={{ cursor: 'pointer' }}
                        />
                        <Typography>Color</Typography>
                    </Box>
                    {showColorPicker && (
                        <SketchPicker
                            color={color}
                            onChangeComplete={(color) => setColor(color.hex)}
                        />
                    )}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: 'green', marginRight: '8px' }}
                    >
                        {event ? 'Update' : 'Add'}
                    </Button>
                    {event && (
                        <Button
                            onClick={() => handleDelete(event._id as string)}
                            variant="contained"
                            style={{ backgroundColor: 'red', color: 'white' }}
                        >
                            Delete
                        </Button>

                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default EventModal;
