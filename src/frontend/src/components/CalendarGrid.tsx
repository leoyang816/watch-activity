import CalendarDayCell from './CalendarDayCell';
import type { CalendarDay } from '../types/study';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface CalendarGridProps {
  month: string;
  days: CalendarDay[];
}

export default function CalendarGrid({ month, days }: CalendarGridProps) {
  const [year, monthNum] = month.split('-').map(Number);
  const firstDay = new Date(year, monthNum - 1, 1);
  const start = new Date(year, monthNum - 1, 1 - firstDay.getDay());
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const cellCount = Math.ceil((firstDay.getDay() + daysInMonth) / 7) * 7;
  const recordsByDate = new Map(days.map((day) => [day.date, day]));

  return (
    <div className="calendar-scroll">
      <div className="calendar-grid" role="grid" aria-label={`Activity calendar for ${month}`}>
        {WEEKDAYS.map((weekday) => (
          <div className="weekday" key={weekday} role="columnheader">{weekday}</div>
        ))}
        {Array.from({ length: cellCount }, (_, index) => {
          const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
          const key = dateKey(date);
          return (
            <CalendarDayCell
              key={key}
              date={key}
              dayNumber={date.getDate()}
              inMonth={date.getMonth() === monthNum - 1}
              record={recordsByDate.get(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
