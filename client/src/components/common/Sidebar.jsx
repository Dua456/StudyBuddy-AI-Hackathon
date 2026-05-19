import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  IoHomeOutline,
  IoCloudUploadOutline,
  IoSparklesOutline,
  IoHelpCircleOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoGlobeOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoLogOutOutline,
  IoCloseOutline,
} from 'react-icons/io5';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: IoHomeOutline },
  { path: '/upload', label: 'Upload Notes', icon: IoCloudUploadOutline },
  { path: '/summary', label: 'AI Summary', icon: IoSparklesOutline },
  { path: '/quiz', label: 'Quiz Generator', icon: IoHelpCircleOutline },
  { path: '/history', label: 'History', icon: IoTimeOutline },
  { path: '/profile', label: 'Profile', icon: IoPersonOutline },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#16213E] border-r border-white/10 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold">StudyBuddy AI</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Home link */}
          <div className="pt-2">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <IoGlobeOutline size={20} />
              <span className="font-medium">Home Page</span>
            </NavLink>
          </div>

          {/* Bottom actions */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 w-full transition-all"
            >
              {darkMode ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
            >
              <IoLogOutOutline size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
