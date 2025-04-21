import { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Providers from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghorer Bazar",
  description: "Discover unique products and inspiring blogs at Korbo Joy.",
  keywords: [
    "e-commerce",
    "Ghorer Bazar",
    "shopping",
    "online shopping",
    "blogs",
    "fashion",
    "accessories",
  ],
  authors: [{ name: "Mahamud Pino", url: "https://ghoerbazar.com" }],
  openGraph: {
    title: "Ghorer Bazar Website",
    description: "Explore a world of unique products and insightful blogs.",
    url: "https://ghoerbazar.com",
    siteName: "Ghorer Bazar",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ghorerbazar.com/cdn/shop/files/logo.webp?v=1707766182&width=500",
        width: 800,
        height: 600,
        alt: "Ghorer Bazar Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
