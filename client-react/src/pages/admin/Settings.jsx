import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGCalStatus, useGCalDisconnect } from '../../hooks/useOverrides';
import { useToast } from '../../components/ui/Toast';
import { Spinner } from '../../components/ui/index';
import api from '../../lib/api';

function GCalCard() {
  const { data, isLoading, refetch } = useGCalStatus();
  const disconnect = useGCalDisconnect();
  const { toast } = useToast();
  const [notConfigured, setNotConfigured] = useState(false);

  const handleConnect = async () => {
    setNotConfigured(false);
    try {
      const res = await api.get('/gcal/auth-url');
      window.location.href = res.data.data.url;
    } catch (err) {
      if (err.code === 'GCAL_NOT_CONFIGURED' || err.status === 503) {
        setNotConfigured(true);
      } else {
        toast('Failed to connect Google Calendar.', 'error');
      }
    }
  };

  const handleDisconnect = async () => {
    await disconnect.mutateAsync();
    toast('Google Calendar disconnected.');
    refetch();
  };

  if (isLoading) return (
    <div className="flex items-center gap-2 text-sm text-indigo-400">
      <Spinner className="h-4 w-4" /> Loading…
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4285F4] flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-200">G</div>
          <div>
            <p className="font-medium text-indigo-900 dark:text-[#f0eeff] text-sm">Google Calendar</p>
            {data?.connected
              ? <p className="text-xs text-emerald-600 dark:text-emerald-400">✓ Connected as {data.email}</p>
              : <p className="text-xs text-indigo-300 dark:text-[#555570]">Not connected — real-time availability sync disabled</p>}
          </div>
        </div>
        {data?.connected
          ? <button onClick={handleDisconnect} disabled={disconnect.isPending}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
              Disconnect
            </button>
          : <button onClick={handleConnect}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#006BFF] hover:bg-[#0052CC] text-white transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
              Connect Google Calendar
            </button>}
      </div>

      {notConfigured && (
        <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 leading-relaxed">
          ⚠️ Google Calendar OAuth is not configured on the server. Add{' '}
          <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded text-xs">GOOGLE_CLIENT_ID</code> and{' '}
          <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded text-xs">GOOGLE_CLIENT_SECRET</code>{' '}
          to your Render environment variables, then redeploy.
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  useEffect(() => { if (searchParams.get('gcal') === 'connected') toast('Google Calendar connected!'); }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-[#f0eeff]">Settings</h1>
        <p className="text-indigo-400 dark:text-[#8888aa] mt-1 text-sm">Manage integrations and account preferences.</p>
      </div>
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="bg-white dark:bg-[#16161f] rounded-2xl border border-indigo-100 dark:border-[#2a2a3a] p-6 shadow-sm shadow-indigo-50 dark:shadow-none">
          <h2 className="font-semibold text-indigo-900 dark:text-[#f0eeff] mb-1">Calendar Integrations</h2>
          <p className="text-xs text-indigo-300 dark:text-[#555570] mb-5">Connect your calendar to sync real-time availability and prevent double bookings.</p>
          <GCalCard />
        </div>
      </div>
    </>
  );
}
