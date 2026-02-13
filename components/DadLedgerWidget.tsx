import React from 'react';
import { useStore } from '../context/Store';
import { formatCurrency } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

const DadLedgerWidget = () => {
  const { summary, transactions, ledgerName } = useStore();
  const dadTransactions = transactions.filter(t => t.isDadRelated).slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden relative group shadow-sm dark:shadow-none">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 dark:bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide mb-1">{ledgerName} Ledger</h3>
            <p className="text-xs text-zinc-500">Track loans & repayments</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400 text-[10px] font-medium uppercase tracking-wider">
            Active
          </div>
        </div>

        <div className="mb-8">
           <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Total Balance</span>
           <div className="text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight">
             {formatCurrency(summary.totalOwedToDad)}
           </div>
           <p className="text-xs text-zinc-500 mt-2">
             Total owed to {ledgerName} by family
           </p>
        </div>

        <div className="flex-1">
          <h4 className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-3">Latest Activity</h4>
          <div className="space-y-3">
             {dadTransactions.length === 0 ? (
               <p className="text-xs text-zinc-500 italic">No history yet.</p>
             ) : (
                dadTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between text-xs group/item">
                    <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-200 font-medium">{tx.borrower || 'Family'}</span>
                        <span className="text-zinc-500 dark:text-zinc-500 text-[10px]">{tx.description}</span>
                    </div>
                    <span className={`font-medium tabular-nums ${tx.type === 'dad_loan' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-500'}`}>
                      {tx.type === 'dad_loan' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
             )}
          </div>
        </div>
        
        <button className="mt-6 w-full group flex items-center justify-between p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:border-zinc-700/50 transition-all text-xs font-medium text-zinc-600 dark:text-zinc-300">
           <span>View Full Ledger</span>
           <ArrowRight className="size-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default DadLedgerWidget;
