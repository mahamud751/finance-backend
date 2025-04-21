"use client";

import { fetchTransactions } from "@/redux/store/TransactionsSlice";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/hooks";

export default function Filters() {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const categories = [
    "Food",
    "Salary",
    "Rent",
    "Entertainment",
    "Utilities",
    "Other",
  ];

  const handleFilter = () => {
    dispatch(
      fetchTransactions({ page: 1, limit: 10, category, startDate, endDate })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
}
