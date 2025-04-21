"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";

import { getTransactions, apiDeleteTransaction } from "@/lib/api";
import { Transaction } from "@/utils/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });

  const categories = [
    "Food",
    "Salary",
    "Rent",
    "Entertainment",
    "Utilities",
    "Other",
  ];

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    try {
      const { data, total: totalCount } = await getTransactions({
        page: pageNum,
        limit,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });
      setTransactions(data);
      setTotal(totalCount);
      setError(null);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load transaction");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, filters]);

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteTransaction(id);
      fetchData(page);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load transaction");
      }
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category: "", startDate: "", endDate: "" });
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transactions</h2>
        <Link
          href="/add-transaction"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Transaction
        </Link>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Filter Transactions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleClearFilters}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
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
                    <Link
                      href={`/edit-transaction/${t.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={20} />
                    </Link>
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
    </div>
  );
}
