"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getTransactions, apiUpdateTransaction } from "@/lib/api";
import { Transaction, UpdateTransactionDto } from "@/utils/types";

export default function TransactionEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<UpdateTransactionDto>({
    description: "",
    amount: 0,
    category: "",
    date: "",
  });
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    async function loadTransaction() {
      try {
        const { data } = await getTransactions({ page: 1, limit: 10 });
        const transaction = data.find((t: Transaction) => t.id === id);
        if (!transaction) throw new Error("Transaction not found");
        setForm({
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category,
          date: transaction.date,
        });
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load transaction");
        }
        setLoading(false);
      }
    }
    loadTransaction();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await apiUpdateTransaction(id as string, form);
      setSuccess("Transaction updated successfully!");
      setErrors({ description: "", amount: "", category: "", date: "" });
      setTimeout(() => router.push("/transactions"), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load transaction");
      }
      setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (error && !success) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white text-white dark:bg-gray-800 p-4 rounded-lg shadow max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Transaction</h1>
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
