import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEventTypes, useCreateEventType, useUpdateEventType, useDeleteEventType } from '../../hooks/useEventTypes';
import EventTypeCard, { EventTypeForm } from '../../components/features/EventTypeCard';
import { Spinner } from '../../components/ui/index';
import { useToast } from '../../components/ui/Toast';

export default function Dashboard() {
  const { data: eventTypes, isLoading } = useEventTypes();
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();
  const deleteMutation = useDeleteEventType();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = async (data) => {
    if (editing) { await updateMutation.mutateAsync({ id: editing.id, ...data }); toast('Event type updated!'); }
    else { await createMutation.mutateAsync(data); toast('Event type created!'); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-[#f0eeff]">Event Types</h1>
          <p className="text-sm text-indigo-500 dark:text-[#8888aa] mt-1">Create and manage your bookable meeting types.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          + New Event Type
        </button>
      </div>

      {eventTypes && eventTypes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Event Types', value: eventTypes.length, color: 'text-indigo-700', bg: 'bg-indigo-100' },
            { label: 'Avg Duration', value: `${Math.round(eventTypes.reduce((a,e)=>a+e.durationMinutes,0)/eventTypes.length)} min`, color: 'text-violet-700', bg: 'bg-violet-100' },
            { label: 'Active Links', value: eventTypes.filter(e=>e.isActive).length, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} dark:bg-[#16161f] rounded-2xl border border-white/60 dark:border-[#2a2a3a] p-5 shadow-sm`}>
              <p className={`text-2xl font-bold tabular-nums ${color} dark:text-[#f0eeff]`}>{value}</p>
              <p className={`text-xs ${color} dark:text-[#8888aa] mt-1 opacity-80`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-32"><Spinner className="h-8 w-8" /></div>
      ) : !eventTypes || eventTypes.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-5 text-3xl">📅</div>
          <h2 className="text-xl font-semibold text-[#1a1523] dark:text-[#f0eeff] mb-2">No event types yet</h2>
          <p className="text-[#6b6b8a] mb-6 max-w-xs text-sm">Create your first event type to start sharing your booking link.</p>
          <button onClick={() => { setEditing(null); setFormOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
            + Create your first event type
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {eventTypes.map((et, i) => (
            <EventTypeCard key={et.id} eventType={et} index={i}
              onEdit={(et) => { setEditing(et); setFormOpen(true); }}
              onDelete={async (id) => { await deleteMutation.mutateAsync(id); toast('Deleted.'); }} />
          ))}
        </div>
      )}

      <EventTypeForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialData={editing} />
    </>
  );
}
