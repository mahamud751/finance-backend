"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/store/hooks";
import { Trash2, Edit } from "lucide-react";
import { Transaction } from "@/utils/types";
import {
  deleteTransaction,
  fetchTransactions,
} from "@/redux/store/TransactionsSlice";
import TransactionForm from "./TransactionForm";

export default function TransactionList({
  transactions,
  total,
  page,
  limit,
  loading,
}: {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}) {
  const dispatch = useAppDispatch();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    dispatch(deleteTransaction(id));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(fetchTransactions({ page: newPage, limit }));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <button
          onClick={() => {
            setEditTransaction(null);
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Transaction
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b dark:border-gray-700">
                  <td className="p-2">{t.description}</td>
                  <td
                    className={`p-2 ${
                      t.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${t.amount.toFixed(2)}
                  </td>
                  <td className="p-2">{t.category}</td>
                  <td className="p-2">{t.date}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <p>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
          {total} transactions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {isModalOpen && (
        <TransactionForm
          transaction={editTransaction}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
