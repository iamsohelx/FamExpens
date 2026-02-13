import React from 'react';
import { useStore } from '../context/Store';
import { formatDate, formatCurrency } from '../lib/utils';
import { ArrowUpRight, ArrowDownLeft, User } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const RecentActivity = () => {
  const { transactions } = useStore();
  const recent = transactions.slice(0, 5);

  return (
    <div className="flex flex-col h-full glass-card rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500">
      <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/50 dark:bg-transparent">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide">Recent Activity</h3>
        <button className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">View All</button>
      </div>

      <div className="flex-1 overflow-auto">
        {recent.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">No activity yet.</div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-zinc-200 dark:divide-zinc-800/50"
          >
            {recent.map((tx) => (
              <motion.div
                key={tx.id}
                variants={item}
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`size-8 rounded-full flex items-center justify-center border ${tx.isDadRelated
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                    }`}>
                    {tx.isDadRelated ? <User className="size-3.5" /> : (
                      tx.type === 'income' ? <ArrowDownLeft className="size-3.5 text-emerald-500 dark:text-emerald-400" /> : <ArrowUpRight className="size-3.5" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-zinc-100 transition-colors">
                      {tx.description}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{tx.category}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600">•</span>
                      <span className="text-[10px] text-zinc-500">{formatDate(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-sm font-medium tabular-nums ${tx.type === 'expense' || tx.type === 'dad_repayment' ? 'text-zinc-900 dark:text-zinc-200' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                  {tx.type === 'expense' || tx.type === 'dad_repayment' ? '-' : '+'}
                  {formatCurrency(tx.amount)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
