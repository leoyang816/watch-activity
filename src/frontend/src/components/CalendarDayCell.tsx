import { AlertCircle, Check, RefreshCw, Watch } from 'lucide-react';
import type { CalendarDay } from '../types/study';

const TODAY = '2026-10-21'; // asof date, don't use the system clock.
const WEAR_MIN = 16;
const SYNC_MIN = 1;

interface CalendarDayCellProps {
  date: string;
  dayNumber: number;
  inMonth: boolean;
  record?: CalendarDay;
}

export default function CalendarDayCell({ date, dayNumber, inMonth, record }: CalendarDayCellProps) {
  const isToday = date === TODAY;
  const isFuture = date > TODAY;
  const isPast = date < TODAY;
  const wearHours = record?.wearHours ?? 0;
  const syncCount = record?.syncCount ?? 0;
  const wearMet = wearHours >= WEAR_MIN;
  const syncMet = syncCount >= SYNC_MIN;
  const bothMet = wearMet && syncMet;
  const noActivity = wearHours === 0 && syncCount === 0;

  // Today and future dates are white; historical activity keeps its status colors.
  const status = !isPast || noActivity ? 'no-data' : bothMet ? 'met' : 'unmet';
  const label = isFuture
    ? ''                      // leave future dates blank
    : isToday && wearHours > 0 && syncCount === 0
      ? 'Waiting to sync'     // today with wear but no sync yet, following the rules
        : isPast && noActivity
          ? 'No activity'
          : '';
  const showMetrics = isPast && !noActivity && record !== undefined;

  return (
    <div
      role="gridcell"
      aria-label={`${date}: ${label || (record ? `${wearHours} wear hours, ${syncCount} syncs` : 'No data')}`}
      className={`day-cell ${status} ${inMonth ? '' : 'outside'}`}
    >
      <span className={`day-number ${isToday ? 'today' : ''}`} aria-current={isToday ? 'date' : undefined}>
        {dayNumber}
      </span>
      {showMetrics && (
        <div className="day-metrics">
          <span title={`Wear: ${wearHours} hours`} className={wearMet ? 'metric-ok' : 'metric-bad'}>
            <Watch size={22} />
            {wearMet ? <Check size={14} /> : <AlertCircle size={14} />}
          </span>
          <span title={`Sync count: ${syncCount}`} className={syncMet ? 'metric-ok' : 'metric-bad'}>
            <RefreshCw size={22} />
            {syncMet ? <Check size={14} /> : <AlertCircle size={14} />}
          </span>
        </div>
      )}
      {label && <div className="day-note">{label}</div>}
    </div>
  );
}
