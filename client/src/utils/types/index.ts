export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface UpdateTransactionDto {
  description: string;
  amount: number;
  category: string;
  date: string;
}
