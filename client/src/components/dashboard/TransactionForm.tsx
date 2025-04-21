"use client";

import {
  addTransaction,
  updateTransaction,
} from "@/redux/store/TransactionsSlice";
import { Transaction } from "@/utils/types";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store/hooks";

export default function TransactionForm({
  transaction,
  onClose,
}: {
  transaction?: Transaction | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    description: transaction?.description || "",
    amount: transaction?.amount.toString() || "",
    category: transaction?.category || "",
    date: transaction?.date || "",
  });
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  const categories = [
    "Food",
    "Salary",
    "Rent",
    "Entertainment",
    "Utilities",
    "Other",
  ];

  const validate = () => {
    const newErrors = { description: "", amount: "", category: "", date: "" };
    if (!form.description) newErrors.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)))
      newErrors.amount = "Valid amount is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const transactionData = {
      description: form.description,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    if (transaction) {
      dispatch(updateTransaction({ id: transaction.id, ...transactionData }));
    } else {
      dispatch(addTransaction(transactionData));
    }
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">
          {transaction ? "Edit" : "Add"} Transaction
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
