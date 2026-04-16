import { cn } from '../../lib/utils';

export function Button({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-200 dark:shadow-none',
    secondary: 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 focus:ring-indigo-300 dark:bg-[#1e1e2a] dark:text-[#f0eeff] dark:border-[#2a2a3a] dark:hover:bg-[#2a2a3a]',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-300 dark:text-[#8888aa] dark:hover:bg-[#1e1e2a]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
      {children}
    </button>
  );
}

export function Input({ label, error, className, id, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-indigo-900 dark:text-[#f0eeff]">{label}</label>}
      <input id={id} className={cn('w-full px-3 py-2 rounded-lg border text-sm transition-colors border-indigo-200 bg-white text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-[#2a2a3a] dark:bg-[#1e1e2a] dark:text-[#f0eeff] dark:placeholder-[#555570]', error && 'border-red-400', className)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className, id, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium text-indigo-900 dark:text-[#f0eeff]">{label}</label>}
      <select id={id} className={cn('w-full px-3 py-2 rounded-lg border text-sm transition-colors border-indigo-200 bg-white text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2a2a3a] dark:bg-[#1e1e2a] dark:text-[#f0eeff]', className)} {...props}>{children}</select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Spinner({ className }) {
  return <svg className={cn('animate-spin h-5 w-5 text-indigo-600', className)} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>;
}

export function StatusBadge({ status }) {
  const styles = { CONFIRMED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', RESCHEDULED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status] || 'bg-[#f3f2ff] text-[#6b6b8a]')}>{status}</span>;
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#16161f] rounded-2xl shadow-2xl shadow-indigo-200/50 dark:shadow-black/50 border border-indigo-100 dark:border-[#2a2a3a] my-8">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-100 dark:border-[#2a2a3a] sticky top-0 bg-white dark:bg-[#16161f] rounded-t-2xl z-10">
            <h2 className="text-lg font-semibold text-indigo-900 dark:text-[#f0eeff]">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-white/10 text-indigo-400">✕</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
