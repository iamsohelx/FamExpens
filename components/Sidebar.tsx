import React from 'react';
import { Home, CreditCard, Users, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/Store';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { ledgerName } = useStore();
  const { signOut } = useAuth();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Expenses', icon: CreditCard, path: '/expenses' },
    { label: `${ledgerName} Ledger`, icon: Users, path: '/dad-ledger' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/50 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <div className="size-3 rounded-full bg-indigo-500"></div>
        </div>
        <span className="hidden lg:block ml-3 font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide text-sm">Ledger</span>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-3 lg:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center lg:justify-start h-10 px-3 rounded-lg transition-all duration-200 group ${isActive
                ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
                }`}
            >
              <item.icon className={`size-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'}`} />
              <span className={`hidden lg:block ml-3 text-xs font-medium tracking-wide ${isActive ? 'text-zinc-900 dark:text-zinc-100' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center lg:justify-start h-10 px-3 rounded-lg text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="hidden lg:block ml-3 text-xs font-medium tracking-wide">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        <button
          onClick={signOut}
          className="flex items-center justify-center lg:justify-start h-10 px-3 rounded-lg text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="size-4" />
          <span className="hidden lg:block ml-3 text-xs font-medium tracking-wide">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
