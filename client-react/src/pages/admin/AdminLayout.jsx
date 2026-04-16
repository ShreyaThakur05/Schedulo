import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-56 min-h-screen bg-[#f0f0ff] dark:bg-[#0d0d14] pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
