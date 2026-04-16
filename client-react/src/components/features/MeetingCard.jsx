import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatLocalDate, formatLocalTime, getInitials } from '../../lib/utils';
import { StatusBadge, Modal, Button } from '../ui/index';
import { format } from 'date-fns';

const KIND_LABEL = { ONE_ON_ONE: '👤 1:1', GROUP: '👥 Group', WEBINAR: '🎙️ Webinar', INTERVIEW: '💼 Interview' };

export default function MeetingCard({ meeting, onCancel, onReschedule, googleCalendarUrl, index }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  const handleCancel = async () => { setCancelling(true); try { await onCancel?.(meeting.id); setCancelOpen(false); } finally { setCancelling(false); } };
  const handleReschedule = async () => {
    if (!newTime) return;
    setRescheduling(true); setRescheduleError('');
    try { await onReschedule?.(meeting.id, new Date(newTime).toISOString()); setRescheduleOpen(false); setNewTime(''); }
    catch (e) { setRescheduleError(e.message); }
    finally { setRescheduling(false); }
  };

  const minDateTime = format(new Date(Date.now() + 60000), "yyyy-MM-dd'T'HH:mm");

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
        className="flex items-center gap-4 p-4 bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] hover:shadow-md hover:shadow-indigo-100/60 dark:hover:shadow-black/20 transition-all">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: meeting.eventType.color }}>
          {getInitials(meeting.inviteeName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#1a1523] dark:text-[#f0eeff]">{meeting.inviteeName}</span>
            <StatusBadge status={meeting.status} />
            {meeting.eventType.eventKind && meeting.eventType.eventKind !== 'ONE_ON_ONE' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3f2ff] dark:bg-[#1e1e2a] text-[#6b6b8a]">{KIND_LABEL[meeting.eventType.eventKind]}</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-[#6b6b8a] dark:text-[#8888aa] flex-wrap">
            <span>{meeting.inviteeEmail}</span>
            <span>·</span><span>{formatLocalDate(meeting.startTime)}</span>
            <span>·</span><span>{formatLocalTime(meeting.startTime)} – {formatLocalTime(meeting.endTime)}</span>
          </div>
          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${meeting.eventType.color}18`, color: meeting.eventType.color }}>{meeting.eventType.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {googleCalendarUrl && <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" title="Add to Google Calendar" className="p-2 rounded-xl hover:bg-[#f3f2ff] text-[#9999bb] hover:text-indigo-600 transition-colors">📅</a>}
          {onReschedule && meeting.status === 'CONFIRMED' && <button onClick={() => setRescheduleOpen(true)} className="p-2 rounded-xl hover:bg-indigo-50 text-[#9999bb] hover:text-indigo-600 transition-colors" title="Reschedule">🔄</button>}
          {onCancel && meeting.status === 'CONFIRMED' && <button onClick={() => setCancelOpen(true)} className="p-2 rounded-xl hover:bg-red-50 text-[#9999bb] hover:text-red-500 transition-colors" title="Cancel">✕</button>}
        </div>
      </motion.div>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Meeting">
        <p className="text-[#6b6b8a] mb-6">Cancel the meeting with <strong className="text-[#1a1523] dark:text-[#f0eeff]">{meeting.inviteeName}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCancelOpen(false)} className="flex-1">Keep It</Button>
          <Button variant="danger" loading={cancelling} onClick={handleCancel} className="flex-1">Cancel Meeting</Button>
        </div>
      </Modal>

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reschedule Meeting">
        <p className="text-sm text-[#6b6b8a] mb-4">Pick a new time for <strong className="text-[#1a1523] dark:text-[#f0eeff]">{meeting.inviteeName}</strong>.</p>
        <div className="mb-4">
          <label className="text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] block mb-1.5">New Date & Time</label>
          <input type="datetime-local" value={newTime} min={minDateTime} onChange={(e) => setNewTime(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] bg-white dark:bg-[#1e1e2a] text-[#1a1523] dark:text-[#f0eeff] focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        {rescheduleError && <p className="text-sm text-red-500 mb-3">{rescheduleError}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setRescheduleOpen(false)} className="flex-1">Cancel</Button>
          <Button loading={rescheduling} onClick={handleReschedule} disabled={!newTime} className="flex-1">Confirm Reschedule</Button>
        </div>
      </Modal>
    </>
  );
}
