export type ScreenType = 'dashboard' | 'analytics' | 'budget';

export interface Transaction {
  id: string;
  name: string;
  time: string;
  amount: number;
  type: 'expense' | 'savings';
  categoryKey: 'essentials' | 'fun' | 'savings' | string;
  categoryName: string;
  icon: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  amount: number;
  spent: number;
  percentage: string;
  burnPct: string;
  patternType: 'hatch' | 'dots' | 'rupee' | 'custom';
}

export interface DayExpense {
  day: number;
  dateStr: string;
  dayLabel: string;
  amount: number;
  description: string;
  isPeak?: boolean;
  isToday?: boolean;
  isZero?: boolean;
}

export interface WeeklyBar {
  day: string;
  amount: number;
  formatted: string;
  desc: string;
  pct: number;
  isPeak?: boolean;
}

export interface MonthlyBar {
  week: string;
  amount: number;
  formatted: string;
  desc: string;
  pct: number;
  isPeak?: boolean;
}

export interface MindfulNote {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  categoryKey?: string;
  categoryName?: string;
  associatedAmount?: number;
  tags: string[];
  pinned?: boolean;
}

export interface GeminiAssistantResponse {
  answer: string;
  quickMetrics?: {
    todaySpent: number;
    todayCount: number;
    remainingMonthBalance: number;
    topCategoryToday?: string;
  };
  suggestedFollowUps?: string[];
  actionTaken?: {
    type: 'logged_expense' | 'created_note' | 'none';
    details?: any;
  };
}
