import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import EventCalendar from './components/EventCalendar';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <EventCalendar />
        </Provider>
    );
};

export default App;
