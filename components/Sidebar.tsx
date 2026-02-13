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
    <aside className="hidden lg:flex w-64 h-screen bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800/50 flex-col fixed left-0 top-0 z-20 transition-all duration-300">
      <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white">
          <CreditCard className="size-5" />
        </div>
        <div className="hidden lg:flex flex-col ml-3">
          <span className="font-heading font-bold text-zinc-900 dark:text-zinc-100 tracking-tight text-lg">DadLedger</span>
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Family Finance</span>
        </div>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-3 lg:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center lg:justify-start h-11 px-3 lg:px-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                ? 'bg-zinc-100 dark:bg-zinc-900/50 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <item.icon className={`size-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
              <span className="hidden lg:block ml-3 text-sm tracking-wide">
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
