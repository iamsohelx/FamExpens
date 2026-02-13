import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, ExpenseSummary } from '../types';
import { generateId } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

interface StoreContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  summary: ExpenseSummary;
  budgetLimit: number;
  ledgerName: string;
  setLedgerName: (name: string) => void;
  familyMembers: string[];
  addFamilyMember: (name: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimit] = useState(2000); // Fixed budget for demo
  const [ledgerName, setLedgerName] = useState('Dad');
  const [familyMembers, setFamilyMembers] = useState<string[]>(['Alex', 'Sarah', 'Mom', 'Dad']);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch transactions for current user
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (txError) {
          console.error('Error fetching transactions:', txError);
        } else if (txData) {
          // Normalize data from snake_case to match Transaction type if needed
          // The schema has is_dad_related, type interface has isDadRelated
          const normalizedTransactions: Transaction[] = txData.map((tx: any) => ({
            ...tx,
            isDadRelated: tx.is_dad_related
          }));
          setTransactions(normalizedTransactions);
        }

        // Fetch settings for current user
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (settingsError) {
          console.log('Error fetching settings (might be empty):', settingsError);
        } else if (settingsData) {
          if (settingsData.ledger_name) setLedgerName(settingsData.ledger_name);
          if (settingsData.family_members) {
            setFamilyMembers(typeof settingsData.family_members === 'string'
              ? JSON.parse(settingsData.family_members)
              : settingsData.family_members);
          }
        }

      } catch (err) {
        console.error('Unexpected error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Persist ledgerName changes
  useEffect(() => {
    if (loading || !user) return;
    const updateSettings = async () => {
      const { error } = await supabase
        .from('settings')
        .upsert({ user_id: user.id, ledger_name: ledgerName });

      if (error) console.error('Error updating ledger name:', error);
    };

    updateSettings();
  }, [ledgerName, loading, user]);

  // Persist familyMembers changes
  useEffect(() => {
    if (loading || !user) return;
    const updateSettings = async () => {
      const { error } = await supabase
        .from('settings')
        .upsert({ user_id: user.id, family_members: familyMembers });

      if (error) console.error('Error updating family members:', error);
    };
    updateSettings();
  }, [familyMembers, loading, user]);

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) return;

    const isDadRelated = newTx.type === 'dad_loan' || newTx.type === 'dad_repayment';

    // Generate ID for optimistic update
    const tempId = generateId();

    const transactionData = {
      ...newTx,
      date: new Date().toISOString(),
      isDadRelated: isDadRelated,
      borrower: isDadRelated ? (newTx.borrower || familyMembers[0] || 'Me') : undefined,
      amount: Number(newTx.amount) || 0,
    };

    // Optimistic Update
    const optimisticTx: Transaction = {
      id: tempId,
      ...transactionData,
    };
    setTransactions(prev => [optimisticTx, ...prev]);

    // Send to Supabase
    // Map to snake_case for DB and include user_id
    const dbPayload = {
      user_id: user.id,
      description: transactionData.description,
      amount: transactionData.amount,
      category: transactionData.category,
      type: transactionData.type,
      borrower: transactionData.borrower,
      is_dad_related: transactionData.isDadRelated,
      date: transactionData.date
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([dbPayload])
      .select();

    if (error) {
      console.error('Error adding transaction to Supabase:', error);
      // Rollback optimistic update
      setTransactions(prev => prev.filter(t => t.id !== tempId));
      alert('Failed to save transaction: ' + error.message);
    } else if (data) {
      // Update the temporary ID with the real one from DB
      const realTx = data[0];
      setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: realTx.id } : t));
    }
  };

  const addFamilyMember = (name: string) => {
    if (!familyMembers.includes(name)) {
      setFamilyMembers(prev => [...prev, name]);
    }
  };

  const calculateSummary = (): ExpenseSummary => {
    let monthlySpent = 0;
    let totalOwedToDad = 0;

    transactions.forEach(tx => {
      const isExpense = tx.type === 'expense';
      const isDadLoan = tx.type === 'dad_loan';
      const isDadRepayment = tx.type === 'dad_repayment';

      if (isExpense) {
        monthlySpent += Number(tx.amount);
      }

      if (isDadLoan) {
        totalOwedToDad += Number(tx.amount);
      } else if (isDadRepayment) {
        totalOwedToDad -= Number(tx.amount);
      }
    });

    return {
      monthlySpent,
      totalOwedToDad,
      remainingBudget: budgetLimit - monthlySpent,
    };
  };

  const summary = calculateSummary();

  return (
    <StoreContext.Provider value={{ transactions, addTransaction, summary, budgetLimit, ledgerName, setLedgerName, familyMembers, addFamilyMember }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};