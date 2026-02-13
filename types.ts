import React from 'react';

export type TransactionType = 'expense' | 'income' | 'dad_loan' | 'dad_repayment';

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  isDadRelated: boolean;
  borrower?: string;
}

export interface ExpenseSummary {
  monthlySpent: number;
  totalOwedToDad: number;
  remainingBudget: number;
}

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}