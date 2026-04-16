import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isBefore, startOfDay } from 'date-fns';
import { useAvailableDates } from '../../hooks/useSlots';
import { Spinner } from '../ui/index';
import 'react-day-picker/dist/style.css';

export default function BookingCalendar({ eventTypeId, onDateSelect, selectedDate }) {
  const [month, setMonth] = useState(new Date());
  const { data: availableDates, isLoading } = useAvailableDates(eventTypeId, month.getFullYear(), month.getMonth() + 1);
  const availableSet = new Set(availableDates || []);
  const today = startOfDay(new Date());
  const isDisabled = (date) => isBefore(date, today) || !availableSet.has(format(date, 'yyyy-MM-dd'));
  const selected = selectedDate ? new Date(selectedDate + 'T12:00:00') : undefined;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-[#16161f]/80 rounded-xl z-10">
          <Spinner />
        </div>
      )}
      <style>{`
        .rdp { margin: 0; --rdp-accent-color: #6366f1; --rdp-accent-background-color: #eef2ff; }
        .rdp-month_caption { font-weight: 600; color: #1a1523; }
        .rdp-weekday { font-size: 0.75rem; font-weight: 500; color: #9999bb; }
        .rdp-day_button { border-radius: 8px; font-size: 0.875rem; color: #1a1523; }
        .rdp-day_button:hover:not([disabled]) { background-color: #eef2ff; color: #6366f1; }
        .rdp-selected .rdp-day_button { background-color: #6366f1 !important; color: white !important; }
        .rdp-disabled .rdp-day_button { opacity: 0.25; cursor: not-allowed; }
        .rdp-today .rdp-day_button { font-weight: 700; color: #6366f1; }
        .rdp-nav button { color: #6b6b8a; border-radius: 8px; }
        .rdp-nav button:hover { background-color: #eef2ff; color: #6366f1; }

        .dark .rdp-month_caption { color: #f0eeff; }
        .dark .rdp-weekday { color: #555570; }
        .dark .rdp-day_button { color: #f0eeff; }
        .dark .rdp-day_button:hover:not([disabled]) { background-color: #1e1e3a; color: #a5b4fc; }
        .dark .rdp-selected .rdp-day_button { background-color: #6366f1 !important; color: white !important; }
        .dark .rdp-today .rdp-day_button { color: #a5b4fc; }
        .dark .rdp-nav button { color: #8888aa; }
        .dark .rdp-nav button:hover { background-color: #1e1e2a; color: #a5b4fc; }
      `}</style>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onDateSelect(format(date, 'yyyy-MM-dd'))}
        disabled={isDisabled}
        month={month}
        onMonthChange={setMonth}
        fromDate={today}
        toDate={new Date(today.getFullYear(), today.getMonth() + 2, 0)}
      />
    </div>
  );
}
