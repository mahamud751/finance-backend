"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useTheme } from "next-themes";

import { getSummary } from "@/lib/api";
import { Summary } from "@/utils/types";

export default function DashboardPage() {
  const { theme } = useTheme();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "Failed to load summary");
      }
    }
    loadSummary();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!summary) return <div>Loading...</div>;

  const chartData = [
    { name: "Income", value: summary.totalIncome },
    { name: "Expenses", value: summary.totalExpenses },
  ];
  const COLORS = ["#0088FE", "#FFBB28"];
  const tooltipStyle = {
    backgroundColor: theme === "dark" ? "#1a202c" : "#ffffff",
    color: theme === "dark" ? "#e2e8f0" : "#1a202c",
    border: "1px solid",
    borderColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
  };
  return (
    <div>
      <div className="p-6 bg-background-light dark:bg-background-dark text-text-light rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded shadow">
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p>${summary.totalIncome.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded shadow">
            <h2 className="text-lg font-semibold">Total Expenses</h2>
            <p>${summary.totalExpenses.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded shadow">
            <h2 className="text-lg font-semibold">Balance</h2>
            <p>${summary.balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {mounted && <Tooltip contentStyle={tooltipStyle} />}
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
