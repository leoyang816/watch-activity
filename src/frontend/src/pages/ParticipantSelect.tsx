import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParticipants } from '../api/study';
import type { Participant } from '../types/study';
export default function ParticipantSelect() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selected, setSelected] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => { const controller = new AbortController(); getParticipants(controller.signal).then(setParticipants).catch(e => { if (e.name !== 'AbortError') setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, []);
    return <main className="select-page"><section className="select-card"><div className="brand-mark">⌚</div><h1>User Participant Study</h1><p>Select a participant to view their watch activity calendar.</p><form onSubmit={e => { e.preventDefault(); if (selected) navigate(`/participants/${encodeURIComponent(selected)}/calendar`); }}><label htmlFor="participant">Participant ID</label><select id="participant" value={selected} onChange={e => setSelected(e.target.value)} disabled={loading || !!error}><option value="">{loading ? 'Loading participants…' : 'Choose a participant'}</option>{participants.map(p => <option key={p.participantId} value={p.participantId}>{p.participantId}</option>)}</select>{error && <p className="error" role="alert">{error}</p>}<button type="submit" disabled={!selected}>View Calendar →</button></form></section></main>;
}
