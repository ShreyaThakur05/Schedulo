import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../lib/theme';
import { cn } from '../../lib/utils';

// REAL Calendly brand mark — path data extracted directly from
// https://marketing-assets.calendly.com/media/logo.svg
// Colors: #006BFF (blue) + #0AE8F0 (cyan) — their exact brand colors
const CalendlyMark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 345 345" className="h-8 w-8">
    <path fill="#006BFF" d="M330.23,202.5a83.62,83.62,0,0,0-34.45-14.81c0,.11,0,.2,0,.3a89.7,89.7,0,0,1-5,17.45,65.58,65.58,0,0,1,28.48,11.73c0,.08-.05.18-.08.27a153.57,153.57,0,1,1,0-90.63c0,.09.05.19.08.27a65.45,65.45,0,0,1-28.48,11.72,90.3,90.3,0,0,1,5,17.47,2.33,2.33,0,0,0,0,.28,83.6,83.6,0,0,0,34.45-14.8c9.82-7.27,7.92-15.48,6.43-20.34a172.13,172.13,0,1,0,0,101.43c1.49-4.86,3.39-13.07-6.43-20.34"/>
    <path fill="#006BFF" d="M231.58,223.23C220.65,232.93,207,245,182.25,245h-14.8c-17.91,0-34.2-6.51-45.86-18.31-11.39-11.53-17.66-27.31-17.66-44.44V162c0-17.13,6.27-32.91,17.66-44.44,11.66-11.8,27.95-18.3,45.86-18.3h14.8c24.78,0,38.4,12.06,49.33,21.76,11.35,10,21.14,18.74,47.25,18.74a75.11,75.11,0,0,0,11.89-.95l-.09-.23a89.53,89.53,0,0,0-5.49-11.28L267.69,97.07a89.65,89.65,0,0,0-77.64-44.82H155.14A89.65,89.65,0,0,0,77.5,97.07L60.05,127.3a89.67,89.67,0,0,0,0,89.65L77.5,247.18A89.65,89.65,0,0,0,155.14,292h34.91a89.65,89.65,0,0,0,77.64-44.82L285.14,217a89.53,89.53,0,0,0,5.49-11.28l.09-.22a74,74,0,0,0-11.89-1c-26.11,0-35.9,8.69-47.25,18.74"/>
    <path fill="#0AE8F0" d="M290.72,138.8a74,74,0,0,1-11.89,1c-26.11,0-35.9-8.69-47.24-18.74-10.94-9.7-24.56-21.77-49.34-21.77h-14.8c-17.92,0-34.2,6.51-45.86,18.31-11.39,11.53-17.66,27.31-17.66,44.44v20.25c0,17.13,6.27,32.91,17.66,44.44,11.66,11.8,27.94,18.3,45.86,18.3h14.8c24.78,0,38.4-12.06,49.34-21.76,11.34-10,21.13-18.74,47.24-18.74a75.11,75.11,0,0,1,11.89.95,89,89,0,0,0,5-17.45,2.68,2.68,0,0,0,0-.3,92.51,92.51,0,0,0-16.94-1.55c-60,0-56.86,40.51-96.58,40.51h-14.8c-27.26,0-45.17-19.48-45.17-44.4V162c0-24.92,17.91-44.39,45.17-44.39h14.8c39.72,0,36.6,40.49,96.58,40.49a91.64,91.64,0,0,0,16.94-1.55c0-.09,0-.18,0-.28a90.3,90.3,0,0,0-5-17.47"/>
  </svg>
);

// Theme-adaptive nav icons
const IconGrid = ({ active }) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" strokeWidth="1.7">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.15' : '0'}/>
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.15' : '0'}/>
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.15' : '0'}/>
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.15' : '0'}/>
  </svg>
);
const IconClock = ({ active }) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" strokeWidth="1.7">
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.1' : '0'}/>
    <path d="M10 6.5v3.75l2.5 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCalendar = ({ active }) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" strokeWidth="1.7">
    <rect x="2.5" y="4" width="15" height="13" rx="2" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.1' : '0'}/>
    <path d="M2.5 8.5h15" stroke="currentColor" strokeLinecap="round"/>
    <path d="M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" strokeLinecap="round"/>
    <circle cx="7" cy="12.5" r="1" fill="currentColor"/>
    <circle cx="10" cy="12.5" r="1" fill="currentColor"/>
    <circle cx="13" cy="12.5" r="1" fill="currentColor"/>
  </svg>
);
const IconChart = ({ active }) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" strokeWidth="1.7">
    <path d="M3 14.5l3.5-4.5 3 3 4-5.5 3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="currentColor" strokeLinecap="round"/>
    {active && <path d="M3 14.5l3.5-4.5 3 3 4-5.5 3 3V17H3z" fill="currentColor" fillOpacity="0.1"/>}
  </svg>
);
const IconSettings = ({ active }) => (
  <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]" strokeWidth="1.7">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? '0.2' : '0'}/>
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" strokeWidth="1.8">
    <circle cx="10" cy="10" r="3.5" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
    <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" strokeWidth="1.8">
    <path d="M16.5 11.5A7 7 0 1 1 8.5 3.5a5 5 0 0 0 8 8z" stroke="currentColor" fill="currentColor" fillOpacity="0.15" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" strokeWidth="1.8">
    <path d="M3 5h14M3 10h14M3 15h10" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" strokeWidth="1.8">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

const navLinks = [
  { to: '/dashboard',    label: 'Event Types', Icon: IconGrid },
  { to: '/availability', label: 'Availability', Icon: IconClock },
  { to: '/meetings',     label: 'Meetings',     Icon: IconCalendar },
  { to: '/analytics',    label: 'Analytics',    Icon: IconChart },
  { to: '/settings',     label: 'Settings',     Icon: IconSettings },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/15 dark:hover:bg-white/10 transition-all text-white/80 dark:text-[#8888aa] hover:text-white dark:hover:text-white hover:scale-110">
      {theme === 'dark' ? <IconSun /> : <IconMoon />}
    </button>
  );
}

function NavContent({ onClose }) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navLinks.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive
                ? 'bg-white/20 text-white dark:bg-indigo-500/15 dark:text-indigo-300 shadow-sm'
                : 'text-white/70 dark:text-[#8888aa] hover:bg-white/10 dark:hover:bg-white/5 hover:text-white dark:hover:text-[#f0eeff]'
            )}>
            {({ isActive }) => (
              <>
                <span className={cn('shrink-0 transition-transform', isActive ? 'scale-110' : '')}>
                  <Icon active={isActive} />
                </span>
                <span className="truncate">{label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-indigo-400 shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 dark:border-[#2a2a3a] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">S</div>
          <span className="text-sm font-medium text-white dark:text-[#f0eeff] truncate" style={{ fontFamily: "'Gilroy', sans-serif" }}>Shreya Thakur</span>
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
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-gradient-to-b from-[#006BFF] via-[#0052CC] to-[#003D99] dark:bg-none dark:bg-[#16161f] border-r border-blue-400/20 dark:border-[#2a2a3a] flex-col z-40 hidden md:flex">
        <div className="h-16 flex items-center px-4 border-b border-white/10 dark:border-[#2a2a3a]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <CalendlyMark />
            <span className="font-bold text-lg text-white dark:text-[#f0eeff] tracking-tight" style={{ fontFamily: "'Gilroy', sans-serif" }}>
              Calendly
            </span>
          </NavLink>
        </div>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-[#006BFF] to-[#0052CC] dark:bg-none dark:bg-[#16161f] border-b border-blue-400/20 dark:border-[#2a2a3a] flex items-center justify-between px-4">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <CalendlyMark />
          <span className="font-bold text-base text-white dark:text-[#f0eeff]" style={{ fontFamily: "'Gilroy', sans-serif" }}>Calendly</span>
        </NavLink>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-white dark:text-[#8888aa]">
            <IconMenu />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-gradient-to-b from-[#006BFF] via-[#0052CC] to-[#003D99] dark:bg-none dark:bg-[#16161f] h-full flex flex-col shadow-2xl">
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 dark:border-[#2a2a3a]">
              <NavLink to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <CalendlyMark />
                <span className="font-bold text-base text-white dark:text-[#f0eeff]" style={{ fontFamily: "'Gilroy', sans-serif" }}>Calendly</span>
              </NavLink>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white">
                <IconX />
              </button>
            </div>
            <NavContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
