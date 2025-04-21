import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSummary,
  getTransactions,
  createTransaction,
  apiUpdateTransaction,
  apiDeleteTransaction,
} from "../../lib/api";
import { Summary, Transaction } from "../../utils/types";

interface TransactionsState {
  transactions: Transaction[];
  summary: Summary | null;
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  summary: null,
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const fetchSummary = createAsyncThunk<Summary>(
  "fetchSummary",
  async () => {
    console.log("Fetching summary from /summary");
    return await getSummary();
  }
);

export const fetchTransactions = createAsyncThunk<
  { data: Transaction[]; total: number; page: number; limit: number },
  {
    page?: number;
    limit?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }
>(
  "transactions/fetchTransactions",
  async ({ page, limit, category, startDate, endDate }) => {
    console.log("Fetching transactions with params:", {
      page,
      limit,
      category,
      startDate,
      endDate,
    });
    return await getTransactions({ page, limit, category, startDate, endDate });
  }
);

export const addTransaction = createAsyncThunk<
  Transaction,
  Omit<Transaction, "id" | "createdAt" | "updatedAt">
>("transactions/addTransaction", async (data) => {
  return await createTransaction(data);
});

export const updateTransaction = createAsyncThunk<
  Transaction,
  {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
  }
>("transactions/updateTransaction", async ({ id, ...data }) => {
  return await apiUpdateTransaction(id, data);
});

export const deleteTransaction = createAsyncThunk<string, string>(
  "transactions/deleteTransaction",
  async (id) => {
    await apiDeleteTransaction(id);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch summary";
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })
      .addCase(addTransaction.pending, (state, action) => {
        const tempId = `temp-${Date.now()}`;
        state.transactions.unshift({
          ...action.meta.arg,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        state.summary = state.summary
          ? {
              ...state.summary,
              totalIncome:
                action.meta.arg.amount > 0
                  ? state.summary.totalIncome + action.meta.arg.amount
                  : state.summary.totalIncome,
              totalExpenses:
                action.meta.arg.amount < 0
                  ? state.summary.totalExpenses +
                    Math.abs(action.meta.arg.amount)
                  : state.summary.totalExpenses,
              balance:
                action.meta.arg.amount > 0
                  ? state.summary.balance + action.meta.arg.amount
                  : state.summary.balance - Math.abs(action.meta.arg.amount),
            }
          : state.summary;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.map((t) =>
          t.id.startsWith("temp-") ? action.payload : t
        );
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => !t.id.startsWith("temp-")
        );
        state.error = action.error.message || "Failed to add transaction";
      })
      .addCase(updateTransaction.pending, (state, action) => {
        const { id, ...data } = action.meta.arg;
        const oldTransaction = state.transactions.find((t) => t.id === id);
        state.transactions = state.transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t
        );
        if (state.summary && oldTransaction) {
          const amountDiff = data.amount - oldTransaction.amount;
          state.summary = {
            ...state.summary,
            totalIncome:
              oldTransaction.amount > 0
                ? state.summary.totalIncome -
                  oldTransaction.amount +
                  (data.amount > 0 ? data.amount : 0)
                : state.summary.totalIncome +
                  (data.amount > 0 ? data.amount : 0),
            totalExpenses:
              oldTransaction.amount < 0
                ? state.summary.totalExpenses -
                  Math.abs(oldTransaction.amount) +
                  (data.amount < 0 ? Math.abs(data.amount) : 0)
                : state.summary.totalExpenses +
                  (data.amount < 0 ? Math.abs(data.amount) : 0),
            balance: state.summary.balance + amountDiff,
          };
        }
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update transaction";
      })
      .addCase(deleteTransaction.pending, (state, action) => {
        const id = action.meta.arg;
        const transaction = state.transactions.find((t) => t.id === id);
        state.transactions = state.transactions.filter((t) => t.id !== id);
        if (state.summary && transaction) {
          state.summary = {
            ...state.summary,
            totalIncome:
              transaction.amount > 0
                ? state.summary.totalIncome - transaction.amount
                : state.summary.totalIncome,
            totalExpenses:
              transaction.amount < 0
                ? state.summary.totalExpenses - Math.abs(transaction.amount)
                : state.summary.totalExpenses,
            balance:
              transaction.amount > 0
                ? state.summary.balance - transaction.amount
                : state.summary.balance + Math.abs(transaction.amount),
          };
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete transaction";
      });
  },
});

export default transactionsSlice.reducer;
