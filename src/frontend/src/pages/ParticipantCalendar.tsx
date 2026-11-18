import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Watch, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { getCalendar } from '../api/study';
import type { CalendarDay, CalendarResponse } from '../types/study';
import CalendarGrid from '../components/CalendarGrid';

const DEFAULT_MONTH = '2026-10';
function shiftMonth(month: string, delta: number) { const [y, m] = month.split('-').map(Number); const date = new Date(y, m - 1 + delta, 1); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; }
function labelMonth(month: string) { const [y, m] = month.split('-').map(Number); return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1)); }

export default function ParticipantCalendar() {
  const { participantId = '' } = useParams();
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController(); 
    setLoading(true); 
    setError(''); 
    setCalendar(null); 

    Promise.all([
      getCalendar(participantId, month, controller.signal),
      getCalendar(participantId, shiftMonth(month, -1), controller.signal),
      getCalendar(participantId, shiftMonth(month, 1), controller.signal),

    ]).then(([current, previous, next]) => {
      const byDate = new Map<string, CalendarDay>();

      for (const day of [...previous.days, ...current.days, ...next.days]) {
        byDate.set(day.date, day);
      }
      setCalendar({ ...current, days: Array.from(byDate.values()) });

    }).catch(e => { 
      if (e.name !== 'AbortError') setError(e.message); 

    }).finally(() => { 
      if (!controller.signal.aborted) setLoading(false); 

    }); 
    return () => controller.abort();
  }, [participantId, month]);

  return <main className="calendar-page">
    <header className="participant-header">
      <Link to="/" aria-label="Back to participant selection" className="back-link">
      <ArrowLeft size={24} />
      </Link>
      <div>
        <h1>Participant {participantId}</h1>
        <p><strong>Site:</strong> {calendar?.site ?? (loading ? 'Loading…' : '—')}</p>
        <p className="device-line"><strong>Device:</strong> {calendar?.deviceId ?? '—'}</p>
      </div>
    </header>
    <section className="calendar-content">
      <div className="month-nav">
        <button aria-label="Previous month" onClick={() => setMonth(m => shiftMonth(m, -1))}>
          <ChevronLeft size={24} />
        </button>
        <button aria-label="Next month" onClick={() => setMonth(m => shiftMonth(m, 1))}><ChevronRight size={24} />
        </button>
        <h2>{labelMonth(month)}</h2>
      </div>
      <div className="legend">
        <span className="legend-title">LEGEND:</span>
        <span><Watch size={21} /> Watch wear</span>
        <span><RefreshCw size={21} /> Watch sync</span>
        <span>
          <span className="legend-circle legend-met"><Check size={16} /></span> 
          Met
        </span>
        <span>
          <span className="legend-circle legend-unmet"><AlertCircle size={16} /></span> 
          Unmet
        </span>
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      {loading ? <p className="loading">Loading calendar…</p> : calendar ? <CalendarGrid month={month} days={calendar.days} /> : null}
    </section>
    </main>;
}
