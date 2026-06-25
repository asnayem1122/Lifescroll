export interface BudgetLimit {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
}

export interface BudgetData {
  month: string;
  budgets: BudgetLimit[];
}

export interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
}

export interface YearlyTrend {
  _id: number;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface SummaryData {
  monthly: MonthlySummary;
  yearlyTrend: YearlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface HeatmapData {
  _id: string;
  total: number;
}
