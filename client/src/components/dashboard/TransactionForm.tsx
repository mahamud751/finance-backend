"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createTransaction } from "@/lib/api";
import { CreateTransactionDto } from "@/utils/types";

export default function AddTransactionPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateTransactionDto>({
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });
  const [success, setSuccess] = useState<string | null>(null);

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
    if (!form.amount || isNaN(form.amount))
      newErrors.amount = "Valid amount is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTransaction(form);
      setSuccess("Transaction added successfully!");
      setErrors({ description: "", amount: "", category: "", date: "" });
      setTimeout(() => router.push("/transactions"), 1000);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({
          ...errors,
          amount: err.message || "Failed to add transaction",
        });
      } else {
        setErrors({
          ...errors,
          amount: "Failed to add transaction",
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow max-w-md mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
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
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Link
            href="/transactions"
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </form>
    </div>
  );
}
