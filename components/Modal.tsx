import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Plus, Check } from 'lucide-react';
import { parseNaturalLanguageTransaction } from '../services/geminiService';
import { useStore } from '../context/Store';
import { TransactionType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, defaultType = 'expense' }) => {
  const { addTransaction, ledgerName, familyMembers, addFamilyMember } = useStore();
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);

  // Manual State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [borrower, setBorrower] = useState('');

  // Adding new member state
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  // AI State
  const [aiInput, setAiInput] = useState('');

  const isLedgerRelated = type === 'dad_loan' || type === 'dad_repayment';

  // Reset and initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setDescription('');
      setAmount('');
      setCategory('');
      setAiInput('');
      setBorrower(familyMembers[0] || '');
      setMode('manual');
      setLoading(false);
      setIsAddingMember(false);
      setNewMemberName('');
    }
  }, [isOpen, defaultType, familyMembers]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    addTransaction({
      description,
      amount: parsedAmount,
      category: category || 'General',
      type,
      isDadRelated: isLedgerRelated,
      borrower: isLedgerRelated ? borrower : undefined,
    });
    onClose();
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setLoading(true);
    const result = await parseNaturalLanguageTransaction(aiInput, ledgerName, familyMembers);
    setLoading(false);

    if (result) {
      addTransaction({
        description: result.description,
        amount: result.amount,
        category: result.category,
        type: result.type,
        isDadRelated: result.type === 'dad_loan' || result.type === 'dad_repayment',
        borrower: result.borrower, // Store handles default
      });
      onClose();
    } else {
      // Fallback error handling
      alert("Could not parse transaction. Please try again or use manual mode.");
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addFamilyMember(newMemberName.trim());
      setBorrower(newMemberName.trim());
      setNewMemberName('');
      setIsAddingMember(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300 z-10"
          >

            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-wide">New Transaction</h3>
              <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                <X className="size-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="p-2 bg-zinc-100 dark:bg-zinc-925 m-4 mb-0 rounded-lg flex gap-1 border border-zinc-200 dark:border-zinc-800/50">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
              >
                Manual
              </button>
              <button
                onClick={() => setMode('ai')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-2 ${mode === 'ai' ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
              >
                <Sparkles className="size-3" />
                AI Assist
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {mode === 'manual' ? (
                <form onSubmit={handleManualSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-medium ml-1">Description</label>
                    <input
                      type="text"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Grocery shopping"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-500 font-medium ml-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-zinc-500 font-medium ml-1">Category</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Food"
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {isLedgerRelated && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-xs text-zinc-500 font-medium ml-1">Who is this for?</label>

                      {!isAddingMember ? (
                        <div className="flex flex-wrap gap-2">
                          {familyMembers.map((member) => (
                            <button
                              key={member}
                              type="button"
                              onClick={() => setBorrower(member)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${borrower === member
                                ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-sm'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                            >
                              {member}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setIsAddingMember(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center gap-1.5 bg-transparent"
                          >
                            <Plus className="size-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Enter name..."
                            className="flex-1 bg-transparent border-none px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddMember();
                              }
                              if (e.key === 'Escape') {
                                setIsAddingMember(false);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddMember}
                            disabled={!newMemberName.trim()}
                            className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                          >
                            <Check className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingMember(false)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-medium ml-1">Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${type === 'expense' ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${type === 'income' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('dad_loan')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${type === 'dad_loan' ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                      >
                        Borrow from {ledgerName}
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('dad_repayment')}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${type === 'dad_repayment' ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                      >
                        Repay {ledgerName}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-2"
                  >
                    Add Transaction
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAiSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-500 font-medium ml-1">Tell me what happened</label>
                    <textarea
                      required
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder={`e.g., Alex borrowed 50 from ${ledgerName} for gas...`}
                      className="w-full h-32 resize-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    {loading ? 'Processing...' : 'Smart Add'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;