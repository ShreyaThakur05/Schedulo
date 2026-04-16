import { useState } from 'react';
import { useAvailability, useUpdateAvailability } from '../../hooks/useAvailability';
import { useOverrides, useUpsertOverride, useDeleteOverride } from '../../hooks/useOverrides';
import AvailabilityEditor from '../../components/features/AvailabilityEditor';
import { Spinner } from '../../components/ui/index';
import { useToast } from '../../components/ui/Toast';
import { format } from 'date-fns';

const timeOptions = [];
for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 15) timeOptions.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`);
const fmt = (t) => { const [h,m] = t.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; };

function OverridesSection() {
  const { data: overrides, isLoading } = useOverrides();
  const upsert = useUpsertOverride();
  const del = useDeleteOverride();
  const { toast } = useToast();
  const [date, setDate] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [start, setStart] = useState('09:00:00');
  const [end, setEnd] = useState('17:00:00');

  const handleAdd = async () => {
    if (!date) return;
    await upsert.mutateAsync({ date, isBlocked, startTime: isBlocked ? null : start, endTime: isBlocked ? null : end });
    toast('Override saved!'); setDate('');
  };

  return (
    <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
            <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff]">Date-Specific Overrides</h2>
      <p className="text-xs text-indigo-300 dark:text-[#555570] mb-5">Block a day or set custom hours for a specific date.</p>
      <div className="flex flex-wrap items-end gap-3 mb-5 p-4 bg-[#f8f7ff] dark:bg-[#1e1e2a] rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a]">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#6b6b8a]">Date</label>
          <input type="date" value={date} min={format(new Date(), 'yyyy-MM-dd')} onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#16161f] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsBlocked(false)} className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors ${!isBlocked ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-[#e8e6f0] text-[#6b6b8a]'}`}>Custom Hours</button>
          <button type="button" onClick={() => setIsBlocked(true)} className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors ${isBlocked ? 'border-red-400 bg-red-50 text-red-600' : 'border-[#e8e6f0] text-[#6b6b8a]'}`}>Block Day</button>
        </div>
        {!isBlocked && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#6b6b8a]">From</label>
              <select value={start} onChange={(e) => setStart(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#16161f] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {timeOptions.map((t) => <option key={t} value={t}>{fmt(t)}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#6b6b8a]">To</label>
              <select value={end} onChange={(e) => setEnd(e.target.value)} className="px-3 py-2 text-sm rounded-lg border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#16161f] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {timeOptions.map((t) => <option key={t} value={t}>{fmt(t)}</option>)}
              </select>
            </div>
          </>
        )}
        <button onClick={handleAdd} disabled={!date || upsert.isPending}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
          {upsert.isPending && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}Add Override
        </button>
      </div>
      {isLoading ? <Spinner className="h-5 w-5" /> : (
        <div className="flex flex-col gap-2">
          {!overrides || overrides.length === 0 ? <p className="text-sm text-[#9999bb]">No overrides set.</p> :
            overrides.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] bg-[#f8f7ff] dark:bg-[#1e1e2a]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1a1523] dark:text-[#f0eeff]">{o.date}</span>
                  {o.isBlocked ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Blocked</span>
                    : <span className="text-xs text-[#6b6b8a]">{o.startTime && fmt(o.startTime)} – {o.endTime && fmt(o.endTime)}</span>}
                </div>
                <button onClick={async () => { await del.mutateAsync(o.date); toast('Override removed.'); }} className="text-xs text-[#9999bb] hover:text-red-500 transition-colors px-2 py-1">Remove</button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function Availability() {
  const { data, isLoading } = useAvailability();
  const updateMutation = useUpdateAvailability();
  const { toast } = useToast();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-[#f0eeff]">Availability</h1>
        <p className="text-indigo-400 dark:text-[#8888aa] mt-1 text-sm">Set your weekly schedule and date-specific overrides.</p>
      </div>
      {isLoading ? <div className="flex items-center justify-center py-32"><Spinner className="h-8 w-8" /></div> : data ? (
        <div className="flex flex-col gap-6">
          <AvailabilityEditor rules={data.rules} timezone={data.timezone} onSave={async (updated) => { await updateMutation.mutateAsync(updated); toast('Availability saved!'); }} loading={updateMutation.isPending} />
          <OverridesSection />
        </div>
      ) : null}
    </>
  );
}
