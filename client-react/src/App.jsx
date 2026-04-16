import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './lib/theme';
import { ToastProvider } from './components/ui/Toast';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Availability from './pages/admin/Availability';
import Meetings from './pages/admin/Meetings';
import Analytics from './pages/admin/Analytics';
import BookingPage from './pages/book/BookingPage';

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/availability" element={<Availability />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              <Route path="/book/:slug" element={<BookingPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
