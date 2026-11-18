import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParticipantSelect from './pages/ParticipantSelect';
import ParticipantCalendar from './pages/ParticipantCalendar';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ParticipantSelect />} />
                <Route path="/participants/:participantId/calendar" element={<ParticipantCalendar />} />
                <Route path="*" element={<ParticipantSelect />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>);
