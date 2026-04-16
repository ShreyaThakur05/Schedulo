import { useState, useMemo } from 'react';
import { useMeetings, useCancelMeeting, useRescheduleMeeting } from '../../hooks/useMeetings';
import MeetingCard from '../../components/features/MeetingCard';
import { Spinner } from '../../components/ui/index';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

function googleCalendarUrl(meeting) {
  const fmt = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const title = encodeURIComponent(`${meeting.eventType.name} with ${meeting.inviteeName}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(meeting.startTime)}/${fmt(meeting.endTime)}&details=Scheduled+via+Schedulo`;
}

function exportCSV(meetings) {
  const header = 'Name,Email,Event Type,Start,End,Status';
  const rows = meetings.map((m) => [m.inviteeName, m.inviteeEmail, m.eventType.name, format(parseISO(m.startTime), 'yyyy-MM-dd HH:mm'), format(parseISO(m.endTime), 'yyyy-MM-dd HH:mm'), m.status].join(','));
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `meetings-${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function Meetings() {
  const [tab, setTab] = useState('upcoming');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');
  const { data: meetings, isLoading } = useMeetings(tab);
  const cancelMutation = useCancelMeeting();
  const rescheduleMutation = useRescheduleMeeting();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!meetings) return [];
    return meetings.filter((m) => {
      if (search && !m.inviteeName.toLowerCase().includes(search.toLowerCase()) && !m.inviteeEmail.toLowerCase().includes(search.toLowerCase()) && !m.eventType.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom || dateTo) {
        const start = parseISO(m.startTime);
        if (dateFrom && start < startOfDay(parseISO(dateFrom))) return false;
        if (dateTo && start > endOfDay(parseISO(dateTo))) return false;
      }
      return true;
    });
  }, [meetings, search, dateFrom, dateTo]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-[#f0eeff]">Meetings</h1>
          <p className="text-indigo-400 dark:text-[#8888aa] mt-1 text-sm">View and manage all your scheduled meetings.</p>
        </div>
        {meetings && meetings.length > 0 && (
          <button onClick={() => exportCSV(filtered)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-indigo-200 dark:border-[#2a2a3a] text-indigo-600 dark:text-[#8888aa] hover:bg-indigo-50 dark:hover:bg-[#1e1e2a] transition-colors">
            ⬇ Export CSV
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm shadow-indigo-100/50 dark:shadow-none">
        <div className="flex gap-1 p-1 bg-indigo-100 dark:bg-[#1e1e2a] rounded-xl">
          {['upcoming', 'past'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                tab === t ? 'bg-white dark:bg-[#16161f] text-indigo-700 dark:text-[#f0eeff] shadow-sm' : 'text-indigo-400 dark:text-[#8888aa] hover:text-indigo-700 dark:hover:text-[#f0eeff]')}>
              {t}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Search name, email, event…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 text-sm rounded-xl border border-indigo-200 dark:border-[#2a2a3a] bg-indigo-50 dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] placeholder-indigo-300 dark:placeholder-[#555570] focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <div className="flex items-center gap-2 flex-wrap">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-indigo-200 dark:border-[#2a2a3a] bg-indigo-50 dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <span className="text-indigo-300 text-sm">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-indigo-200 dark:border-[#2a2a3a] bg-indigo-50 dark:bg-[#1e1e2a] text-indigo-900 dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {(dateFrom || dateTo || search) && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); setSearch(''); }} className="text-xs text-indigo-300 hover:text-red-500 px-2 py-1 transition-colors">Clear</button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24"><Spinner className="h-8 w-8" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-lg font-semibold text-indigo-900 dark:text-[#f0eeff] mb-1">No {tab} meetings{search || dateFrom || dateTo ? ' matching filters' : ''}</h2>
          <p className="text-indigo-400 dark:text-[#8888aa] text-sm">{tab === 'upcoming' ? 'Share your booking link to get meetings scheduled.' : 'Past meetings will appear here.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((meeting, i) => (
            <MeetingCard key={meeting.id} meeting={meeting} index={i}
              onCancel={tab === 'upcoming' ? async (id) => { await cancelMutation.mutateAsync({ id }); toast('Meeting cancelled.'); } : undefined}
              onReschedule={tab === 'upcoming' ? async (id, newStartTime) => { await rescheduleMutation.mutateAsync({ id, newStartTime }); toast('Meeting rescheduled!'); } : undefined}
              googleCalendarUrl={googleCalendarUrl(meeting)} />
          ))}
        </div>
      )}
    </>
  );
}
