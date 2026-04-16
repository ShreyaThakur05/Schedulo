import { useState, useEffect } from 'react';
import { DAY_NAMES, cn } from '../../lib/utils';

const TIMEZONES = ['UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Sao_Paulo','Europe/London','Europe/Paris','Europe/Berlin','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland'];
const timeOptions = [];
for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 15) timeOptions.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`);
const fmt = (t) => { const [h,m] = t.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; };

function Toggle({ active, onChange }) {
  return <button type="button" onClick={onChange} className={cn('relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500', active ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-[#2a2a3a]')}><span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform', active ? 'translate-x-5' : 'translate-x-0')} /></button>;
}

export default function AvailabilityEditor({ rules: initialRules, timezone: initialTz, onSave, loading }) {
  const [timezone, setTimezone] = useState(initialTz);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    setTimezone(initialTz);
    setRules(Array.from({ length: 7 }, (_, i) => initialRules.find((r) => r.dayOfWeek === i) || { dayOfWeek: i, startTime: '09:00:00', endTime: '17:00:00', timezone: initialTz, isActive: false }));
  }, [initialRules, initialTz]);

  const updateRule = (day, rule) => setRules((prev) => prev.map((r) => r.dayOfWeek === day ? rule : r));

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff]">Weekly Hours</h2>
            <p className="text-sm text-indigo-400 dark:text-[#8888aa] mt-0.5">{rules.filter(r=>r.isActive).length} days per week</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#6b6b8a]">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[#e8e6f0] dark:divide-[#2a2a3a]">
          {rules.map((rule) => (
            <div key={rule.dayOfWeek} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <Toggle active={rule.isActive} onChange={() => updateRule(rule.dayOfWeek, { ...rule, isActive: !rule.isActive })} />
              <div className="w-28 shrink-0"><span className={cn('text-sm font-semibold', rule.isActive ? 'text-[#1a1523] dark:text-[#f0eeff]' : 'text-[#9999bb]')}>{DAY_NAMES[rule.dayOfWeek]}</span></div>
              {rule.isActive ? (
                <div className="flex items-center gap-3 flex-1">
                  <select value={rule.startTime} onChange={(e) => updateRule(rule.dayOfWeek, { ...rule, startTime: e.target.value })} className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[110px]">{timeOptions.map((t) => <option key={t} value={t}>{fmt(t)}</option>)}</select>
                  <span className="text-[#9999bb] text-sm">—</span>
                  <select value={rule.endTime} onChange={(e) => updateRule(rule.dayOfWeek, { ...rule, endTime: e.target.value })} className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[110px]">{timeOptions.map((t) => <option key={t} value={t}>{fmt(t)}</option>)}</select>
                </div>
              ) : <span className="text-sm text-[#9999bb] italic">Unavailable</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
        <h3 className="text-sm font-semibold text-indigo-900 dark:text-[#f0eeff] mb-3">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {[{label:'Weekdays 9–5',days:[1,2,3,4,5],start:'09:00:00',end:'17:00:00'},{label:'Mon–Fri 8–6',days:[1,2,3,4,5],start:'08:00:00',end:'18:00:00'},{label:'Every day 10–6',days:[0,1,2,3,4,5,6],start:'10:00:00',end:'18:00:00'}].map(({label,days,start,end}) => (
            <button key={label} type="button" onClick={() => setRules((prev) => prev.map((r) => ({ ...r, isActive: days.includes(r.dayOfWeek), startTime: days.includes(r.dayOfWeek) ? start : r.startTime, endTime: days.includes(r.dayOfWeek) ? end : r.endTime })))} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] text-[#6b6b8a] hover:border-indigo-400 hover:text-indigo-600 transition-colors">{label}</button>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => onSave({ rules: rules.map((r) => ({ ...r, timezone })), timezone })} disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}Save Changes
        </button>
      </div>
    </div>
  );
}
