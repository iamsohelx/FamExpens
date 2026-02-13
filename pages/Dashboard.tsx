import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { formatCurrency } from '../lib/utils';
import { Plus } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DadLedgerWidget from '../components/DadLedgerWidget';
import RecentActivity from '../components/RecentActivity';
import Modal from '../components/Modal';
import EditBudgetModal from '../components/EditBudgetModal';

const Dashboard = () => {
  const { summary, ledgerName } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800/50 px-8 py-5 flex items-center justify-between transition-colors duration-300">
        <div className="flex flex-col">
          <h1 className="text-xl font-heading font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Good evening, Family</h1>
          <span className="text-xs text-zinc-500 font-medium tracking-wide mt-0.5">{today}</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-95 group"
        >
          <Plus className="size-4 group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide">Quick Add</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-6 lg:space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <StatsCard
            title="Monthly Spent"
            value={formatCurrency(summary.monthlySpent)}
            trend="+12% from last month"
            trendUp={false}
            index={0}
          />
          <StatsCard
            title="Remaining Budget"
            value={formatCurrency(summary.remainingBudget)}
            trend="On track"
            trendUp={true}
            index={1}
            onClick={() => setIsBudgetModalOpen(true)}
          />
          <StatsCard
            title={`Total Owed to ${ledgerName}`}
            value={formatCurrency(summary.totalOwedToDad)}
            highlight={true}
            index={2}
          />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[500px]">
          {/* Dad Ledger - Takes up 1 column */}
          <div className="lg:col-span-1 h-full min-h-[300px]">
            <DadLedgerWidget />
          </div>

          {/* Recent Activity - Takes up 2 columns */}
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <RecentActivity />
          </div>
        </div>

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditBudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
