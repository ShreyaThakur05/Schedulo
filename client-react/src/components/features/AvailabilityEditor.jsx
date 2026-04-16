import { useState, useEffect } from 'react';
import { DAY_NAMES, cn } from '../../lib/utils';

const TIMEZONES = ['UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Sao_Paulo','Europe/London','Europe/Paris','Europe/Berlin','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];

// Only generate hours on the hour and half-hour for a cleaner, shorter list
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

function TimeSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-[90px] px-2 py-1.5 text-xs rounded-lg border border-indigo-200 dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
      {timeOptions.map((t) => <option key={t} value={t}>{fmt(t)}</option>)}
    </select>
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
      {/* Weekly hours card */}
      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-indigo-50 dark:border-[#2a2a3a]">
          <div>
            <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] text-sm">Weekly Hours</h2>
            <p className="text-xs text-indigo-400 dark:text-[#8888aa] mt-0.5">
              {rules.filter(r => r.isActive).length} days enabled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-indigo-500 dark:text-[#8888aa] whitespace-nowrap">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
              className="flex-1 sm:flex-none text-xs px-2 py-1.5 rounded-lg border border-indigo-200 dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[180px]">
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>

        {/* Day rows */}
        <div className="divide-y divide-indigo-50 dark:divide-[#2a2a3a]">
          {rules.map((rule) => (
            <div key={rule.dayOfWeek} className="flex items-center gap-3 px-4 sm:px-5 py-3">
              {/* Toggle */}
              <Toggle active={rule.isActive} onChange={() => updateRule(rule.dayOfWeek, { ...rule, isActive: !rule.isActive })} />

              {/* Day name — abbreviated on mobile */}
              <span className={cn('text-sm font-medium shrink-0 w-8 sm:w-24',
                rule.isActive ? 'text-indigo-900 dark:text-[#f0eeff]' : 'text-indigo-300 dark:text-[#555570]')}>
                <span className="hidden sm:inline">{DAY_NAMES[rule.dayOfWeek]}</span>
                <span className="sm:hidden">{DAY_NAMES[rule.dayOfWeek].slice(0, 3)}</span>
              </span>

              {/* Time range or unavailable */}
              {rule.isActive ? (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <TimeSelect value={rule.startTime} onChange={(v) => updateRule(rule.dayOfWeek, { ...rule, startTime: v })} />
                  <span className="text-indigo-300 dark:text-[#555570] text-xs font-medium">–</span>
                  <TimeSelect value={rule.endTime} onChange={(v) => updateRule(rule.dayOfWeek, { ...rule, endTime: v })} />
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
