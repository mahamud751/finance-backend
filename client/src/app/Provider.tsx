"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";

import { store } from "@/redux/store";
import Navbar from "@/components/layout/Navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <Navbar />
        {children}
      </Provider>
    </ThemeProvider>
  );
}
