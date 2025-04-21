"use client";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

import { store } from "@/redux/store";
import Header from "@/components/layout/Header";

import "../app/globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Finance Tracker",
//   description: "Track your income and expenses",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider store={store}>
            <Header />
            <main className="container mx-auto p-4">{children}</main>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
