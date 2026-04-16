import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEventTypeBySlug } from '../../hooks/useEventTypes';
import BookingCalendar from '../../components/features/BookingCalendar';
import TimeSlotPicker from '../../components/features/TimeSlotPicker';
import { Spinner, Input } from '../../components/ui/index';
import { format } from 'date-fns';
import { formatLocalDate, formatLocalTime } from '../../lib/utils';
import api from '../../lib/api';

function googleCalUrl(startTime, endTime, title) {
  // Format: 20240115T090000Z  (no dashes, no colons, ends with Z)
  const fmt = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(startTime)}/${fmt(endTime)}`;
}

function BookingForm({ slot, eventType, onBack, onConfirmed }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await api.post('/meetings', {
        eventTypeId: eventType.id,
        inviteeName: form.name,
        inviteeEmail: form.email,
        startTime: slot.startTime,
      });
      onConfirmed(res.data.data);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally { setLoading(false); }
  };

  return (
    <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#6b6b8a] hover:text-[#1a1523] dark:hover:text-[#f0eeff] mb-5 transition-colors">
        ← Back to slots
      </button>
      <div className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-600/20 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-1">{formatLocalDate(slot.startTime)}</p>
        <p className="text-sm text-indigo-600 dark:text-indigo-300">{formatLocalTime(slot.startTime)} – {formatLocalTime(slot.endTime)}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="name" label="Your Name" placeholder="Arjun Sharma" value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
        <Input id="email" label="Email Address" type="email" placeholder="arjun@example.com" value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
        {errors.submit && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{errors.submit}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-1">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Confirm Booking
        </button>
      </form>
    </motion.div>
  );
}

function Confirmation({ meeting, eventType, onBookAnother }) {
  const [copied, setCopied] = useState(false);
  const calUrl = googleCalUrl(meeting.startTime, meeting.endTime, eventType.name);
  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/book/${eventType.slug}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-2">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 18 }}
        className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/15 rounded-full flex items-center justify-center mb-4 text-2xl">✓</motion.div>
      <h2 className="text-lg font-bold text-[#1a1523] dark:text-[#f0eeff] mb-1">You're confirmed!</h2>
      <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa] mb-5">
        Confirmation sent to <strong className="text-[#1a1523] dark:text-[#f0eeff]">{meeting.inviteeEmail}</strong>
      </p>
      <div className="w-full bg-[#f8f7ff] dark:bg-white/5 border border-[#e8e6f0] dark:border-[#2a2a3a] rounded-xl p-4 text-left mb-5 flex flex-col gap-2">
        <p className="font-semibold text-[#1a1523] dark:text-[#f0eeff] text-sm">{eventType.name}</p>
        <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa]">📅 {formatLocalDate(meeting.startTime)}</p>
        <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa]">🕐 {formatLocalTime(meeting.startTime)} – {formatLocalTime(meeting.endTime)}</p>
        <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa]">✉️ {meeting.inviteeEmail}</p>
      </div>
      <div className="flex gap-2 w-full mb-4">
        <a href={calUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] hover:bg-[#f3f2ff] dark:hover:bg-white/5 transition-colors">
          📅 Add to Google Calendar
        </a>
        <button onClick={copyLink}
          className="px-4 py-2.5 rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] hover:bg-[#f3f2ff] dark:hover:bg-white/5 transition-colors">
          {copied ? '✓' : '📋'}
        </button>
      </div>
      <button onClick={onBookAnother} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
        Book another time
      </button>
    </motion.div>
  );
}

export default function BookingPage() {
  const { slug } = useParams();
  const { data: eventType, isLoading, isError } = useEventTypeBySlug(slug);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedMeeting, setConfirmedMeeting] = useState(null);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const resetBooking = () => { setSelectedDate(null); setSelectedSlot(null); setConfirmedMeeting(null); };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff] dark:bg-[#0d0d14]">
      <Spinner className="h-8 w-8" />
    </div>
  );

  if (isError || !eventType) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff] dark:bg-[#0d0d14] text-center px-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1523] dark:text-[#f0eeff] mb-2">Page not found</h1>
        <p className="text-[#6b6b8a]">This booking link doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7ff] dark:bg-[#0d0d14] flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-5xl bg-white dark:bg-[#16161f] rounded-2xl border border-[#e8e6f0] dark:border-[#2a2a3a] shadow-xl overflow-hidden">
        {/* Always 3 columns on desktop: info | calendar | right panel */}
        <div className="flex flex-col md:flex-row">

          {/* Col 1 — Host info */}
          <div className="md:w-64 shrink-0 p-7 border-b md:border-b-0 md:border-r border-[#e8e6f0] dark:border-[#2a2a3a]">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-4">
              {eventType.user?.name?.[0] ?? 'A'}
            </div>
            {eventType.user && <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa] mb-1">{eventType.user.name}</p>}
            <h1 className="text-xl font-bold text-[#1a1523] dark:text-[#f0eeff] mb-3">{eventType.name}</h1>
            <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa] mb-2">🕐 {eventType.durationMinutes} minutes</p>
            {eventType.description && (
              <p className="text-sm text-[#6b6b8a] dark:text-[#8888aa] mb-4 leading-relaxed">{eventType.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-[#9999bb] dark:text-[#555570] mt-4 pt-4 border-t border-[#e8e6f0] dark:border-[#2a2a3a]">
              🌍 <span className="truncate">{userTimezone}</span>
            </div>
          </div>

          {/* Col 2 — Calendar (always visible) */}
          <div className="md:w-80 shrink-0 p-7 border-b md:border-b-0 md:border-r border-[#e8e6f0] dark:border-[#2a2a3a]">
            <h2 className="text-sm font-semibold text-[#1a1523] dark:text-[#f0eeff] mb-5">Select a Date</h2>
            <BookingCalendar
              eventTypeId={eventType.id}
              onDateSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); setConfirmedMeeting(null); }}
              selectedDate={selectedDate}
            />
          </div>

          {/* Col 3 — Slots / Form / Confirmation (always visible, shows prompt when no date) */}
          <div className="flex-1 p-7 min-h-[400px]">
            <AnimatePresence mode="wait">
              {confirmedMeeting ? (
                <Confirmation key="confirmed" meeting={confirmedMeeting} eventType={eventType} onBookAnother={resetBooking} />
              ) : selectedSlot ? (
                <BookingForm key="form" slot={selectedSlot} eventType={eventType} onBack={() => setSelectedSlot(null)} onConfirmed={setConfirmedMeeting} />
              ) : selectedDate ? (
                <motion.div key="slots" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-sm font-semibold text-[#1a1523] dark:text-[#f0eeff] mb-5">
                    {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, MMMM d')}
                  </h2>
                  <TimeSlotPicker date={selectedDate} eventTypeId={eventType.id} onSlotSelect={setSelectedSlot} selectedSlot={selectedSlot} />
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center pt-16">
                  <div className="text-4xl mb-4">👈</div>
                  <p className="text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] mb-1">Pick a date</p>
                  <p className="text-xs text-[#9999bb] dark:text-[#555570]">Select an available date to see time slots</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
