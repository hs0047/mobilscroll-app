import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
    _id: string;
    id?: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    priority?: string;
    color?: string;
}

interface EventsState {
    events: Event[];
}

const initialState: EventsState = {
    events: [],
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<Event[]>) {
            state.events = action.payload;
        },
        addEvent(state, action: PayloadAction<Event>) {
            state.events.push(action.payload);
        },
        updateEvent(state, action: PayloadAction<Event>) {
            const index = state.events.findIndex((event) => event._id === action.payload._id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent(state, action: PayloadAction<string>) {
            state.events = state.events.filter((event) => event._id !== action.payload);
        },
    },
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export const selectEvents = (state: { events: EventsState }) => state.events.events;
export default eventsSlice.reducer;
