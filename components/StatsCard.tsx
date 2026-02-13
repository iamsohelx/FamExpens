import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
  index?: number;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendUp, highlight, index = 0, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
      relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
      ${highlight
          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20 border-none'
          : 'bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm hover:shadow-md'}
    `}>
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className={`text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-indigo-100' : 'text-zinc-500'}`}>{title}</span>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className={`text-3xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {value}
          </span>
          {trend && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${highlight
                ? 'bg-white/20 text-white backdrop-blur-sm'
                : trendUp
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
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
