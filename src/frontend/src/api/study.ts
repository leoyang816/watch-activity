import type { Participant, CalendarResponse } from '../types/study';
const BASE = '/api/studies/alpha';

async function getJSON<objType>(path: string, signal?: AbortSignal): Promise<objType> {
    const response = await fetch(path, { signal });
    if (!response.ok) throw new Error(`Request failed (${response.status}): ${await response.text()}`);
    return response.json() as Promise<objType>;
}

export const getParticipants = 
    (signal?: AbortSignal) => getJSON<Participant[]>(`${BASE}/participants`, signal);
    
export const getCalendar = 
    (id: string, month: string, signal?: AbortSignal) => 
        getJSON<CalendarResponse>(`${BASE}/participants/${encodeURIComponent(id)}/calendar?month=${encodeURIComponent(month)}`, signal);
