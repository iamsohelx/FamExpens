import React, { useState } from 'react';
import { Home, CreditCard, Users, Menu, Sun, Moon, LogOut, X } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/Store';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { ledgerName } = useStore();
    const { signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Expenses', icon: CreditCard, path: '/expenses' },
        { label: 'Ledger', icon: Users, path: '/dad-ledger' },
    ];

    return (
        <>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 pointer-events-none">
                <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 flex items-center justify-between px-2 py-2 pointer-events-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-12 rounded-xl transition-all duration-300 relative ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl"
                                    />
                                )}
                                <item.icon className={`size-5 mb-0.5 relative z-10 ${isActive ? 'fill-current' : ''}`} />
                                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-full h-12 rounded-xl transition-all duration-300 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200`}
                    >
                        <Menu className="size-5 mb-0.5" />
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 rounded-t-3xl p-6 lg:hidden border-t border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-heading font-semibold text-zinc-900 dark:text-zinc-100">Menu</h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-500"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium"
                                >
                                    {theme === 'dark' ? <Sun className="size-5 mr-3" /> : <Moon className="size-5 mr-3" />}
                                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                </button>

                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center w-full p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-medium"
                                >
                                    <LogOut className="size-5 mr-3" />
                                    Sign Out
                                </button>
                            </div>

                            <div className="mt-8 text-center text-xs text-zinc-400">
                                <p>DadLedger v1.0</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default BottomNav;
