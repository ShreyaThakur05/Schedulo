import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { clsx } from 'clsx';

export function cn(...inputs) { return clsx(inputs); }

export function formatInTimezone(isoString, timezone, fmt = 'PPP p') {
  const zoned = toZonedTime(parseISO(isoString), timezone);
  return format(zoned, fmt);
}

export function formatLocalTime(isoString, fmt = 'h:mm a') {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatInTimezone(isoString, tz, fmt);
}

export function formatLocalDate(isoString) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatInTimezone(isoString, tz, 'EEEE, MMMM d, yyyy');
}

export function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DURATION_OPTIONS = [15, 30, 45, 60];
export const COLOR_OPTIONS = ['#6366f1','#7c3aed','#059669','#dc2626','#d97706','#0891b2','#be185d','#65a30d'];
