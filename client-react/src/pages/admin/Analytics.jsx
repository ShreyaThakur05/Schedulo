import { useAnalytics } from '../../hooks/useAnalytics';
import { Spinner } from '../../components/ui/index';
import { format, parseISO } from 'date-fns';

const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const KIND_LABEL = { ONE_ON_ONE: '👤 1:1', GROUP: '👥 Group', WEBINAR: '🎙️ Webinar', INTERVIEW: '💼 Interview' };

function StatCard({ label, value, sub, color, bg }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${bg}`}>
      <p className="text-sm mb-1 opacity-75 font-medium">{label}</p>
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const { data, isLoading } = useAnalytics();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-[#f0eeff]">Analytics</h1>
        <p className="text-indigo-400 dark:text-[#8888aa] mt-1 text-sm">Insights into your scheduling activity.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32"><Spinner className="h-8 w-8" /></div>
      ) : !data ? null : (
        <div className="flex flex-col gap-6">
          {/* Stat cards — each with its own color */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Meetings" value={data.total} color="text-indigo-700 dark:text-[#f0eeff]" bg="bg-indigo-100 border-indigo-200 dark:bg-[#16161f] dark:border-[#2a2a3a]" />
            <StatCard label="Confirmed" value={data.confirmed} sub="active bookings" color="text-emerald-700 dark:text-emerald-400" bg="bg-emerald-100 border-emerald-200 dark:bg-[#16161f] dark:border-[#2a2a3a]" />
            <StatCard label="Cancelled" value={data.cancelled} sub={`${data.cancellationRate}% rate`} color="text-rose-700 dark:text-red-400" bg="bg-rose-100 border-rose-200 dark:bg-[#16161f] dark:border-[#2a2a3a]" />
            <StatCard label="Conversion Rate" value={`${data.overallConversion}%`} sub={`${data.totalPageViews} page views`} color="text-white" bg="bg-indigo-600 border-indigo-500 shadow-indigo-200 dark:shadow-none" />
          </div>

          {/* Daily chart */}
          <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
            <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] mb-1">Meetings — Last 30 Days</h2>
            <p className="text-xs text-indigo-300 dark:text-[#555570] mb-5">Confirmed bookings per day</p>
            <div className="flex items-end gap-[3px] h-32 w-full">
              {data.daily.map((d, i) => {
                const max = Math.max(...data.daily.map(x => x.count), 1);
                const pct = (d.count / max) * 100;
                return (
                  <div key={d.date} className="flex flex-col items-center flex-1 gap-1">
                    <div className="w-full rounded-t-sm bg-indigo-400 hover:bg-indigo-600 dark:bg-indigo-500/80 dark:hover:bg-indigo-400 transition-colors"
                      style={{ height: `${Math.max(pct, 2)}%` }} title={`${d.date}: ${d.count}`} />
                    {i % 5 === 0 && <span className="text-[9px] text-indigo-300 dark:text-[#555570] leading-none">{format(parseISO(d.date), 'MMM d')}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion by event type */}
            <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
              <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] mb-1">Conversion by Event Type</h2>
              <p className="text-xs text-indigo-300 dark:text-[#555570] mb-4">Page views → bookings</p>
              {data.byEventType.length === 0 ? <p className="text-sm text-indigo-300">No data yet.</p> : (
                <div className="flex flex-col gap-4">
                  {data.byEventType.sort((a,b) => b.bookings - a.bookings).map((et) => (
                    <div key={et.eventTypeId}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: et.color }} />
                          <span className="text-sm font-medium text-indigo-900 dark:text-[#f0eeff]">{et.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-indigo-400 dark:text-[#8888aa]">
                          <span>{et.pageViews} views</span><span>→</span><span>{et.bookings} bookings</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{et.conversionRate}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-indigo-100 dark:bg-[#1e1e2a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${et.conversionRate}%`, backgroundColor: et.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By kind + busiest days */}
            <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
              <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] mb-4">By Meeting Type</h2>
              {Object.keys(data.byKind).length === 0 ? <p className="text-sm text-indigo-300">No data yet.</p> : (
                <div className="flex flex-col gap-3 mb-6">
                  {Object.entries(data.byKind).sort((a,b) => b[1]-a[1]).map(([kind, count]) => {
                    const total = Object.values(data.byKind).reduce((s,v) => s+v, 0);
                    const pct = total > 0 ? Math.round((count/total)*100) : 0;
                    return (
                      <div key={kind}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-indigo-900 dark:text-[#f0eeff]">{KIND_LABEL[kind] ?? kind}</span>
                          <span className="text-sm text-indigo-400 dark:text-[#8888aa] tabular-nums">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-indigo-100 dark:bg-[#1e1e2a] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] mb-1">Busiest Days</h2>
              <p className="text-xs text-indigo-300 dark:text-[#555570] mb-4">Last 30 days by day of week</p>
              <div className="flex items-end gap-2 h-24">
                {data.byDow.map((d) => {
                  const max = Math.max(...data.byDow.map(x => x.count), 1);
                  const pct = (d.count / max) * 100;
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="text-xs font-medium text-indigo-500 dark:text-[#8888aa] tabular-nums">{d.count}</span>
                      <div className="w-full rounded-lg bg-violet-400 dark:bg-purple-500/60 hover:bg-violet-500 transition-colors"
                        style={{ height: `${Math.max(pct, 6)}%`, minHeight: '6px' }} />
                      <span className="text-xs text-indigo-300 dark:text-[#555570]">{DAY_SHORT[d.day]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
