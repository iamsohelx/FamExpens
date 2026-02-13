import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/Store';
import { motion, AnimatePresence } from 'framer-motion';

interface EditBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ isOpen, onClose }) => {
    const { budgetLimit, setBudgetLimit } = useStore();
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount(budgetLimit.toString());
        }
    }, [isOpen, budgetLimit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setBudgetLimit(parsedAmount);
        onClose();
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
                        className="relative w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300 z-10"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-wide">Edit Monthly Budget</h3>
                            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-zinc-500 font-medium ml-1">Monthly Limit</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-7 pr-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditBudgetModal;
