import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../lib/theme';
import { cn } from '../../lib/utils';

const IconGrid = () => <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="6" height="6" rx="1.5"/><rect x="12" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="12" width="6" height="6" rx="1.5"/><rect x="12" y="12" width="6" height="6" rx="1.5"/></svg>;
const IconClock = () => <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconCalendar = () => <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.6"><rect x="2.5" y="4" width="15" height="13.5" rx="2"/><path d="M2.5 8.5h15" strokeLinecap="round"/><path d="M6.5 2.5v3M13.5 2.5v3" strokeLinecap="round"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="13" cy="12" r="1" fill="currentColor" stroke="none"/></svg>;
const IconChart = () => <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.6"><path d="M3 15l4-5 3 3 4-6 3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17.5h14" strokeLinecap="round"/></svg>;
const IconSettings = () => <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" strokeLinecap="round"/></svg>;
const IconSun = () => <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="10" r="3.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" strokeLinecap="round"/></svg>;
const IconMoon = () => <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.7"><path d="M17 11.5A7 7 0 1 1 8.5 3a5.5 5.5 0 0 0 8.5 8.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconMenu = () => <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7"><path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round"/></svg>;
const IconX = () => <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round"/></svg>;
const IconLogo = () => <svg viewBox="0 0 28 28" fill="none" className="h-7 w-7"><rect width="28" height="28" rx="8" fill="#6366f1"/><path d="M7 14.5l4.5 4.5L21 9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const navLinks = [
  { to: '/dashboard', label: 'Event Types', Icon: IconGrid },
  { to: '/availability', label: 'Availability', Icon: IconClock },
  { to: '/meetings', label: 'Meetings', Icon: IconCalendar },
  { to: '/analytics', label: 'Analytics', Icon: IconChart },
  { to: '/settings', label: 'Settings', Icon: IconSettings },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/15 dark:hover:bg-white/10 transition-colors text-white/70 dark:text-[#8888aa] hover:text-white dark:hover:text-white">
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}

function NavContent({ onClose }) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navLinks.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
              isActive
                ? 'bg-white/20 text-white dark:bg-indigo-500/15 dark:text-indigo-400'
                : 'text-white/70 dark:text-[#8888aa] hover:bg-white/10 dark:hover:bg-white/5 hover:text-white dark:hover:text-[#f0eeff]')}>
            {({ isActive }) => (<>
              <span className={cn('shrink-0', isActive ? 'text-white dark:text-indigo-400' : 'text-white/50 dark:text-[#9999bb]')}><Icon /></span>
              {label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-indigo-400" />}
            </>)}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 dark:border-[#2a2a3a] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">S</div>
          <span className="text-sm font-medium text-white dark:text-[#f0eeff] truncate">Shreya Thakur</span>
        </div>
        <ThemeToggle />
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-56 bg-gradient-to-b from-indigo-600 via-indigo-700 to-violet-800 dark:bg-none dark:bg-[#16161f] border-r border-indigo-500/30 dark:border-[#2a2a3a] flex-col z-40 hidden md:flex">
        <div className="h-16 flex items-center px-5 border-b border-white/10 dark:border-[#2a2a3a]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5"><IconLogo /><span className="font-bold text-base text-white dark:text-[#f0eeff] tracking-tight">Schedulo</span></NavLink>
        </div>
        <NavContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-indigo-600 to-violet-700 dark:bg-none dark:bg-[#16161f] border-b border-indigo-500/30 dark:border-[#2a2a3a] flex items-center justify-between px-4">
        <NavLink to="/dashboard" className="flex items-center gap-2"><IconLogo /><span className="font-bold text-sm text-white dark:text-[#f0eeff]">Schedulo</span></NavLink>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 dark:hover:bg-white/10 text-white dark:text-[#8888aa]"><IconMenu /></button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-gradient-to-b from-indigo-600 via-indigo-700 to-violet-800 dark:bg-none dark:bg-[#16161f] h-full flex flex-col shadow-2xl">
            <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 dark:border-[#2a2a3a]">
              <NavLink to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}><IconLogo /><span className="font-bold text-sm text-white dark:text-[#f0eeff]">Schedulo</span></NavLink>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white dark:text-[#6b6b8a]"><IconX /></button>
            </div>
            <NavContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
