import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, CheckSquare, MessageSquare, Calendar, LogOut, Sun, Moon, HelpCircle, Briefcase } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleSidebar = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg font-sans transition-colors duration-300">
      <aside className="w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col pt-6">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xl">L</div>
          <span className="text-xl font-display font-bold text-gray-800 dark:text-white">LearnHub</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><BookOpen size={20} /> Dashboard</NavLink>
          <NavLink to="/tasks" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><CheckSquare size={20} /> Tasks</NavLink>
          <NavLink to="/chat" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><MessageSquare size={20} /> Chat</NavLink>
          <NavLink to="/appointments" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><Calendar size={20} /> Appointments</NavLink>
          <NavLink to="/tickets" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><HelpCircle size={20} /> Tickets</NavLink>
          <NavLink to="/jobs" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border'}`}><Briefcase size={20} /> Jobs</NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-border space-y-2">
          <button onClick={toggleSidebar} className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors">Theme {darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-8 z-10 animate-fade-in">
          <h1 className="text-lg font-semibold dark:text-gray-200 capitalize">Welcome back, {user?.name || 'User'} 👋</h1>
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">{user?.name?.charAt(0) || 'U'}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
