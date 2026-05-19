import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { IoMenuOutline, IoHomeOutline, IoCloudUploadOutline, IoSparklesOutline, IoHelpCircleOutline, IoPersonOutline } from 'react-icons/io5';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0F0F1A]/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoMenuOutline size={24} />
            </button>
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center font-bold text-sm">
                S
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#16213E]/95 backdrop-blur-lg border-t border-white/10 z-40">
        <div className="flex justify-around py-2">
          {[
            { path: '/dashboard', label: 'Home', icon: IoHomeOutline },
            { path: '/upload', label: 'Upload', icon: IoCloudUploadOutline },
            { path: '/summary', label: 'AI', icon: IoSparklesOutline },
            { path: '/quiz', label: 'Quiz', icon: IoHelpCircleOutline },
            { path: '/profile', label: 'Profile', icon: IoPersonOutline },
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                  isActive ? 'text-[#6C63FF]' : 'text-gray-400'
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
