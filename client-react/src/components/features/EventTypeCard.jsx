import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../ui/Toast';
import { cn, COLOR_OPTIONS, DURATION_OPTIONS } from '../../lib/utils';
import { Modal, Input, Select, Button } from '../ui/index';

const EVENT_KINDS = [
  { value: 'ONE_ON_ONE', label: '1:1 Meeting', emoji: '👤' },
  { value: 'GROUP', label: 'Group Session', emoji: '👥' },
  { value: 'WEBINAR', label: 'Webinar', emoji: '🎙️' },
  { value: 'INTERVIEW', label: 'Interview Slot', emoji: '💼' },
];

const KIND_LABEL = { ONE_ON_ONE: '👤 1:1', GROUP: '👥 Group', WEBINAR: '🎙️ Webinar', INTERVIEW: '💼 Interview' };

function ShareModal({ eventType, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/book/${eventType.slug}`;
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#16161f] rounded-2xl shadow-2xl border border-[#e8e6f0] dark:border-[#2a2a3a] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#1a1523] dark:text-[#f0eeff]">Share booking link</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f3f2ff] text-[#6b6b8a]">✕</button>
        </div>
        <div className="flex items-center gap-2 p-3 bg-[#f3f2ff] dark:bg-white/5 rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] mb-4">
          <span className="text-sm text-[#6b6b8a] flex-1 truncate font-mono">{url}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
          <a href={`/book/${eventType.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e8e6f0] dark:border-[#2a2a3a] text-[#6b6b8a] hover:bg-[#f3f2ff] text-sm font-medium transition-colors">
            Preview
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export function EventTypeForm({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({ name: '', slug: '', durationMinutes: 30, bufferMinutes: 0, maxPerDay: '', eventKind: 'ONE_ON_ONE', description: '', color: '#6366f1' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useState(() => {
    if (initialData) {
      setForm({ name: initialData.name, slug: initialData.slug, durationMinutes: initialData.durationMinutes, bufferMinutes: initialData.bufferMinutes ?? 0, maxPerDay: initialData.maxPerDay ?? '', eventKind: initialData.eventKind ?? 'ONE_ON_ONE', description: initialData.description || '', color: initialData.color });
    } else {
      setForm({ name: '', slug: '', durationMinutes: 30, bufferMinutes: 0, maxPerDay: '', eventKind: 'ONE_ON_ONE', description: '', color: '#6366f1' });
    }
    setErrors({});
  }, [initialData, open]);

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.slug.trim()) e.slug = 'Slug is required.';
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Lowercase alphanumeric with hyphens only.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, maxPerDay: form.maxPerDay === '' ? null : Number(form.maxPerDay) });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally { setLoading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Event Type' : 'New Event Type'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] block mb-2">Event Kind</label>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_KINDS.map((k) => (
              <button key={k.value} type="button" onClick={() => setForm((f) => ({ ...f, eventKind: k.value }))}
                className={cn('flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left',
                  form.eventKind === k.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300' : 'border-[#e8e6f0] dark:border-[#2a2a3a] text-[#6b6b8a] hover:border-indigo-300')}>
                <span>{k.emoji}</span>{k.label}
              </button>
            ))}
          </div>
        </div>
        <Input id="name" label="Name" placeholder="30 Min Chat" value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: initialData ? f.slug : autoSlug(e.target.value) }))} error={errors.name} />
        <Input id="slug" label="Slug (URL)" placeholder="30-min-chat" value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} error={errors.slug} disabled={!!initialData} />
        <div className="grid grid-cols-2 gap-3">
          <Select id="duration" label="Duration" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: parseInt(e.target.value) }))}>
            {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d} minutes</option>)}
          </Select>
          <Select id="buffer" label="Buffer After" value={form.bufferMinutes} onChange={(e) => setForm((f) => ({ ...f, bufferMinutes: parseInt(e.target.value) }))}>
            {[0,5,10,15,30].map((b) => <option key={b} value={b}>{b === 0 ? 'No buffer' : `${b} min`}</option>)}
          </Select>
        </div>
        <Input id="maxPerDay" label="Max meetings/day (optional)" type="number" placeholder="e.g. 5" value={form.maxPerDay} onChange={(e) => setForm((f) => ({ ...f, maxPerDay: e.target.value }))} />
        <Input id="description" label="Description (optional)" placeholder="A quick intro call..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <div>
          <label className="text-sm font-medium text-[#1a1523] dark:text-[#f0eeff] block mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button key={c} type="button" onClick={() => setForm((f) => ({ ...f, color: c }))}
                className={cn('w-8 h-8 rounded-full transition-all', form.color === c ? 'ring-2 ring-offset-2 ring-indigo-400 scale-110' : 'hover:scale-105')}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">{initialData ? 'Save Changes' : 'Create Event Type'}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function EventTypeCard({ eventType, onEdit, onDelete, index }) {
  const { toast } = useToast();
  const [shareOpen, setShareOpen] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/book/${eventType.slug}`);
    toast('Booking link copied!');
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 26 }}
        className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] overflow-hidden hover:shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-black/30 transition-all duration-200">
        <div className="h-1 w-full" style={{ backgroundColor: eventType.color }} />
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${eventType.color}18` }}>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" style={{ color: eventType.color }}><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#1a1523] dark:text-[#f0eeff] truncate">{eventType.name}</h3>
              <p className="text-xs text-[#9999bb] mt-0.5 font-mono truncate">/book/{eventType.slug}</p>
            </div>
          </div>
          {eventType.description && <p className="text-sm text-indigo-500 dark:text-[#8888aa] mb-4 line-clamp-2">{eventType.description}</p>}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${eventType.color}12`, color: eventType.color }}>{eventType.durationMinutes} min</span>
            {eventType.bufferMinutes > 0 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">+{eventType.bufferMinutes}m buffer</span>}
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#f3f2ff] dark:bg-[#1e1e2a] text-[#6b6b8a]">{KIND_LABEL[eventType.eventKind] ?? eventType.eventKind}</span>
          </div>
          <div className="flex items-center gap-1.5 pt-4 border-t border-indigo-50 dark:border-[#2a2a3a]">
            <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#6b6b8a] hover:bg-[#f3f2ff] hover:text-indigo-600 transition-colors">📋 Copy</button>
            <button onClick={() => setShareOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-[#6b6b8a] hover:bg-[#f3f2ff] hover:text-indigo-600 transition-colors">🔗 Share</button>
            <button onClick={() => onEdit(eventType)} className="p-2 rounded-lg text-[#9999bb] hover:bg-[#f3f2ff] hover:text-[#6b6b8a] transition-colors">✏️</button>
            <button onClick={() => onDelete(eventType.id)} className="p-2 rounded-lg text-[#9999bb] hover:bg-red-50 hover:text-red-500 transition-colors">🗑️</button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{shareOpen && <ShareModal eventType={eventType} onClose={() => setShareOpen(false)} />}</AnimatePresence>
    </>
  );
}
