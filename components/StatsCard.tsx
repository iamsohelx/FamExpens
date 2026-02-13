import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
  index?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendUp, highlight, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`
      relative overflow-hidden rounded-xl border p-6 transition-colors duration-300 group shadow-sm
      ${highlight
          ? 'bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/20 dark:to-zinc-900 border-indigo-200 dark:border-indigo-500/20'
          : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700/50'}
    `}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-2xl font-semibold tracking-tight ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {value}
          </span>
          {trend && (
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Subtle shine effect on hover (dark mode only or subtle in light) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </motion.div>
  );
};

export default StatsCard;
