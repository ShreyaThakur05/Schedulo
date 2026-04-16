import { useState, useEffect, useRef } from 'react';
import { DAY_NAMES, cn } from '../../lib/utils';

const TIMEZONES = ['UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Sao_Paulo','Europe/London','Europe/Paris','Europe/Berlin','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];

const timeOptions = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    timeOptions.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`);
  }
}

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

// Custom dropdown — renders inline, never overflows viewport
function TimeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Scroll selected item into view when opening
  const listRef = useRef(null);
  useEffect(() => {
    if (open && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) selected.scrollIntoView({ block: 'center' });
    }
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-[86px] flex items-center justify-between gap-1 px-2 py-1.5 text-xs rounded-lg border transition-colors',
          open
            ? 'border-[#006BFF] ring-2 ring-[#006BFF]/20 bg-white dark:bg-[#1e1e2a]'
            : 'border-indigo-200 dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] hover:border-[#006BFF]',
          'text-indigo-900 dark:text-[#f0eeff]'
        )}
      >
        <span className="truncate">{fmt(value)}</span>
        <svg viewBox="0 0 10 6" fill="none" className={cn('h-2.5 w-2.5 shrink-0 transition-transform', open ? 'rotate-180' : '')} stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Inline dropdown list — renders below, max-h with scroll */}
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 top-full mt-1 z-50 w-[100px] max-h-48 overflow-y-auto rounded-xl border border-indigo-100 dark:border-[#2a2a3a] bg-white dark:bg-[#16161f] shadow-lg shadow-indigo-100/50 dark:shadow-black/40"
          style={{ scrollbarWidth: 'thin' }}
        >
          {timeOptions.map((t) => (
            <button
              key={t}
              type="button"
              data-selected={t === value}
              onClick={() => { onChange(t); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-1.5 text-xs transition-colors',
                t === value
                  ? 'bg-[#006BFF] text-white font-medium'
                  : 'text-indigo-800 dark:text-[#f0eeff] hover:bg-indigo-50 dark:hover:bg-[#1e1e2a]'
              )}
            >
              {fmt(t)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ active, onChange }) {
  return (
    <button type="button" onClick={onChange}
      className={cn('relative w-10 h-5 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        active ? 'bg-[#006BFF]' : 'bg-gray-200 dark:bg-[#2a2a3a]')}>
      <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
        active ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  );
}

export default function AvailabilityEditor({ rules: initialRules, timezone: initialTz, onSave, loading }) {
  const [timezone, setTimezone] = useState(initialTz);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    setTimezone(initialTz);
    setRules(Array.from({ length: 7 }, (_, i) =>
      initialRules.find((r) => r.dayOfWeek === i) ||
      { dayOfWeek: i, startTime: '09:00:00', endTime: '17:00:00', timezone: initialTz, isActive: false }
    ));
  }, [initialRules, initialTz]);

  const updateRule = (day, rule) => setRules((prev) => prev.map((r) => r.dayOfWeek === day ? rule : r));

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] overflow-visible shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-indigo-50 dark:border-[#2a2a3a]">
          <div>
            <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] text-sm">Weekly Hours</h2>
            <p className="text-xs text-indigo-400 dark:text-[#8888aa] mt-0.5">{rules.filter(r => r.isActive).length} days enabled</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-indigo-500 dark:text-[#8888aa] whitespace-nowrap">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-indigo-200 dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[180px]">
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>

        {/* Day rows */}
        <div className="divide-y divide-indigo-50 dark:divide-[#2a2a3a]">
          {rules.map((rule) => (
            <div key={rule.dayOfWeek} className="flex items-center gap-3 px-4 sm:px-5 py-3">
              <Toggle active={rule.isActive} onChange={() => updateRule(rule.dayOfWeek, { ...rule, isActive: !rule.isActive })} />
              <span className={cn('text-sm font-medium shrink-0 w-8 sm:w-24',
                rule.isActive ? 'text-indigo-900 dark:text-[#f0eeff]' : 'text-indigo-300 dark:text-[#555570]')}>
                <span className="hidden sm:inline">{DAY_NAMES[rule.dayOfWeek]}</span>
                <span className="sm:hidden">{DAY_NAMES[rule.dayOfWeek].slice(0, 3)}</span>
              </span>
              {rule.isActive ? (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <TimeDropdown value={rule.startTime} onChange={(v) => updateRule(rule.dayOfWeek, { ...rule, startTime: v })} />
                  <span className="text-indigo-300 dark:text-[#555570] text-xs">–</span>
                  <TimeDropdown value={rule.endTime} onChange={(v) => updateRule(rule.dayOfWeek, { ...rule, endTime: v })} />
                </div>
              ) : (
                <span className="text-xs text-indigo-300 dark:text-[#555570] italic">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-indigo-900 dark:text-[#f0eeff] mb-3 uppercase tracking-wide">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Weekdays 9–5', days: [1,2,3,4,5], start: '09:00:00', end: '17:00:00' },
            { label: 'Mon–Fri 8–6',  days: [1,2,3,4,5], start: '08:00:00', end: '18:00:00' },
            { label: 'Every day 10–6', days: [0,1,2,3,4,5,6], start: '10:00:00', end: '18:00:00' },
          ].map(({ label, days, start, end }) => (
            <button key={label} type="button"
              onClick={() => setRules((prev) => prev.map((r) => ({
                ...r,
                isActive: days.includes(r.dayOfWeek),
                startTime: days.includes(r.dayOfWeek) ? start : r.startTime,
                endTime: days.includes(r.dayOfWeek) ? end : r.endTime,
              })))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 dark:border-[#2a2a3a] text-indigo-600 dark:text-[#8888aa] hover:bg-indigo-50 dark:hover:bg-[#1e1e2a] hover:border-blue-400 transition-colors">
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave({ rules: rules.map((r) => ({ ...r, timezone })), timezone })}
          disabled={loading}
          className="px-6 py-2.5 bg-[#006BFF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-blue-200 dark:shadow-none">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
