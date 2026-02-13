import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, Download, Wallet, Pencil, Check, X as XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const DadLedgerPage = () => {
  const { transactions, summary, ledgerName, setLedgerName } = useStore();
  const dadTransactions = transactions.filter(t => t.isDadRelated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Name State
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(ledgerName);

  const startEditing = () => {
    setTempName(ledgerName);
    setIsEditing(true);
  };

  const saveName = () => {
    if (tempName.trim()) {
      setLedgerName(tempName.trim());
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setTempName(ledgerName);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-2 text-xs font-medium tracking-wide">
              <ArrowLeft className="size-3" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 h-9">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button onClick={saveName} className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">
                    <Check className="size-4" />
                  </button>
                  <button onClick={cancelEditing} className="p-1.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20">
                    <XIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group">
                  <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{ledgerName} Ledger</h1>
                  <button onClick={startEditing} className="text-zinc-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Pencil className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-xs font-medium shadow-lg shadow-indigo-500/20"
            >
              <Wallet className="size-3.5" />
              Repay {ledgerName}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-xs font-medium">
              <Download className="size-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Big Balance Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-zinc-900 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden shadow-sm dark:shadow-none gap-4">
          <div className="relative z-10">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Outstanding Balance</span>
            <div className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight">{formatCurrency(summary.totalOwedToDad)}</div>
          </div>
          <div className="hidden sm:block text-right relative z-10">
            <p className="text-zinc-500 text-xs max-w-[200px]">
              This balance reflects all loans minus any repayments made to date.
            </p>
          </div>

          {/* Decorative sheen */}
          <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        {/* Transaction History Table */}
        {/* Transaction History */}
        <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          {/* Desktop Table */}
          <table className="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/50 text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-transparent">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Borrower</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {dadTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">No transactions found with {ledgerName}.</td>
                </tr>
              ) : (
                dadTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-zinc-800 dark:text-zinc-300">{tx.borrower || 'Me'}</td>
                    <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-200 font-medium">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium text-right tabular-nums ${tx.type === 'dad_loan' ? 'text-zinc-900 dark:text-zinc-200' : 'text-emerald-600 dark:text-emerald-500'}`}>
                      {tx.type === 'dad_loan' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {dadTransactions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">No transactions found with {ledgerName}.</div>
            ) : (
              dadTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex flex-col gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{tx.description}</span>
                      <span className="text-xs text-zinc-500">{formatDate(tx.date)} • {tx.borrower || 'Me'}</span>
                    </div>
                    <span className={`text-sm font-semibold tabular-nums ${tx.type === 'dad_loan' ? 'text-zinc-900 dark:text-zinc-200' : 'text-emerald-600 dark:text-emerald-500'}`}>
                      {tx.type === 'dad_loan' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <span className="self-start inline-flex items-center px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                    {tx.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType="dad_repayment"
      />
    </div>
  );
};

export default DadLedgerPage;