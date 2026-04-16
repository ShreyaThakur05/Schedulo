import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../lib/theme';
import { cn } from '../../lib/utils';

// Logo — no padding box, flush with sidebar, fills header height
const CalendlyMark = () => (
  <img src="/calendly-logo.png" alt="Calendly" className="h-11 w-auto object-contain object-left" />
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
const IconSettings = ({ active }) => null;
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
        <div className="h-20 flex items-center px-4 border-b border-white/10 dark:border-[#2a2a3a]">
          <NavLink to="/dashboard" className="flex items-center">
            <CalendlyMark />
          </NavLink>
        </div>
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-gradient-to-r from-[#006BFF] to-[#0052CC] dark:bg-none dark:bg-[#16161f] border-b border-blue-400/20 dark:border-[#2a2a3a] flex items-center justify-between px-4">
        <NavLink to="/dashboard" className="flex items-center">
          <img src="/calendly-logo.png" alt="Calendly" className="h-8 w-auto object-contain" />
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
              <NavLink to="/dashboard" className="flex items-center" onClick={() => setMobileOpen(false)}>
                <img src="/calendly-logo.png" alt="Calendly" className="h-8 w-auto object-contain" />
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
