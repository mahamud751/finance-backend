"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark p-4 shadow-md mb-12">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Finance Tracker
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/">Dashboard</Link>
          <Link href="/transactions">Transactions</Link>
          <Link href="/add-transaction">Add Transaction</Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
