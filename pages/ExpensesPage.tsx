import React from 'react';
import { useStore } from '../context/Store';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpensesPage = () => {
  const { transactions } = useStore();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-2 text-xs font-medium tracking-wide mb-4">
            <ArrowLeft className="size-3" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">All Expenses</h1>
        </div>

        <div className="grid gap-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 p-4 rounded-xl flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center size-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{new Date(tx.date).getDate()}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{tx.description}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{tx.category} • {tx.type.replace('_', ' ')}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold tabular-nums ${tx.type === 'expense' || tx.type === 'dad_repayment' ? 'text-zinc-900 dark:text-zinc-200' : 'text-emerald-600 dark:text-emerald-500'}`}>
                {tx.type === 'expense' || tx.type === 'dad_repayment' ? '-' : '+'}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
