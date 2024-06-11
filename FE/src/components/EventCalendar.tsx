import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eventcalendar, MbscEventClickEvent, MbscEventDragEvent } from '@mobiscroll/react';
import axios from '../api/axios';
import { setEvents, selectEvents, updateEvent, deleteEvent } from '../features/events/eventsSlice';
import EventModal from './EventModal';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Button, MenuItem, Select, TextField, Box } from '@mui/material';

const EventCalendar: React.FC = () => {
    const events = useSelector(selectEvents);
    const dispatch = useDispatch();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [view, setView] = useState<'month' | 'week' | 'year'>('month');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [titleFilter, setTitleFilter] = useState('');

    const deepClone = (obj: any) => {
        return JSON.parse(JSON.stringify(obj));
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await axios.get('/events');
            const eventsWithId = response.data.map((event: any) => {
                const clonedEvent = deepClone(event);
                clonedEvent.id = clonedEvent._id;
                return clonedEvent;
            });
            dispatch(setEvents(eventsWithId));
        };

        fetchEvents();
    }, [dispatch]);


    const handleEventClick = (event: MbscEventClickEvent) => {
        setSelectedEvent(event.event);
        setModalOpen(true);
    };


    const handleModalClose = () => {
        setSelectedEvent(null);
        setModalOpen(false);
    };

    const handleDragEnd = async (event: MbscEventDragEvent) => {
        const { event: draggedEvent } = event;
        const updatedEvent = { ...draggedEvent };
        const response = await axios.put(`/events/${draggedEvent._id}`, updatedEvent);
        dispatch(updateEvent(response.data));
    };

    const handleDeleteEvent = async (eventId: string) => {
        await axios.delete(`/events/${eventId}`);
        dispatch(deleteEvent(eventId));
        handleModalClose();
    };


    const handleViewChange = (view: 'month' | 'week' | 'year') => {
        setView(view);
    };

    const handlePriorityFilterChange = (event: any) => {
        setPriorityFilter(event.target.value as string);
    };

    const handleTitleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleFilter(e.target.value);
    };

    const filteredEvents = events.filter(event => {
        return (
            (!priorityFilter || event.priority === priorityFilter) &&
            (!titleFilter || event.title.toLowerCase().includes(titleFilter.toLowerCase()))
        );
    });

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                    <Button variant="contained" onClick={() => handleViewChange('week')}>Week View</Button>
                    <Button variant="contained" onClick={() => handleViewChange('month')}>Month View</Button>
                    <Button variant="contained" onClick={() => handleViewChange('year')}>Year View</Button>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>New Event</Button>
                </Box>
            </Box>
            <Box display="flex" mb={2}>
                <TextField
                    label="Filter by Title"
                    value={titleFilter}
                    onChange={handleTitleFilterChange}
                    style={{ marginRight: '16px' }}
                />
                <Select
                    value={priorityFilter}
                    onChange={handlePriorityFilterChange}
                    displayEmpty
                    style={{ width: '200px' }}
                >
                    <MenuItem value=""><em>All Priorities</em></MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
            </Box>
            <Eventcalendar
                data={filteredEvents}
                onEventClick={handleEventClick}
                onEventDragEnd={handleDragEnd}
                view={{ calendar: { type: view } }}
                clickToCreate="double"
                dragToCreate={true}
                dragToMove={true}
                dragToResize={true}
                height={600}
            />
            <EventModal open={modalOpen} handleClose={handleModalClose} event={selectedEvent} handleDelete={handleDeleteEvent}
 />
        </Box>
    );
};

export default EventCalendar;
