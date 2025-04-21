"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store/hooks";

import SummaryCard from "@/components/dashboard/SummarCard";
import Filters from "@/components/dashboard/Filter";
import TransactionList from "@/components/dashboard/TransactionList";
import PieChart from "@/components/dashboard/PieChart";
import {
  fetchSummary,
  fetchTransactions,
} from "@/redux/store/TransactionsSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { summary, transactions, total, page, limit, loading } = useSelector(
    (state: any) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchTransactions({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Income" value={summary?.totalIncome || 0} />
        <SummaryCard
          title="Total Expenses"
          value={summary?.totalExpenses || 0}
        />
        <SummaryCard title="Balance" value={summary?.balance || 0} />
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <PieChart
            data={{
              income: summary?.totalIncome || 0,
              expenses: summary?.totalExpenses || 0,
            }}
          />
        </div>
      </div>
      <Filters />
      <TransactionList
        transactions={transactions}
        total={total}
        page={page}
        limit={limit}
        loading={loading}
      />
    </div>
  );
}
