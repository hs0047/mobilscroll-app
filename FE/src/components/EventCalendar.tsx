import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eventcalendar, MbscEventClickEvent } from '@mobiscroll/react';
import axios from '../api/axios';
import { setEvents, selectEvents, deleteEvent } from '../features/events/eventsSlice';
import EventModal from './EventModal';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

const EventCalendar: React.FC = () => {
    const events = useSelector(selectEvents);
    const dispatch = useDispatch();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const deepClone = (obj: any) => {
        return JSON.parse(JSON.stringify(obj));
    };

    const fetchEvents = async () => {
        const response = await axios.get('/events');
        const eventsWithId = response.data.map((event: any) => {
            const clonedEvent = deepClone(event);
            console.log('Fetched Event:', event);
            console.log('Cloned Event:', clonedEvent);
            clonedEvent.id = clonedEvent._id;
            return clonedEvent;
        });
        console.log('Events with IDs:', eventsWithId);
        dispatch(setEvents(eventsWithId));
    };

    useEffect(() => {
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

    const handleDeleteEvent = async (eventId: string) => {
        await axios.delete(`/events/${eventId}`);
        dispatch(deleteEvent(eventId));
    };

    return (
        <>
            <Eventcalendar
                data={events}
                onEventClick={handleEventClick}
                view={{
                    calendar: { type: 'month' }
                }}
                clickToCreate="double"
                dragToCreate={true}
                dragToMove={true}
                dragToResize={true}
            />
            <EventModal open={modalOpen} handleClose={handleModalClose} event={selectedEvent} />
        </>
    );
};

export default EventCalendar;
