import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parking Lagbe — Smart Parking in Bangladesh",
  description:
    "Find, compare, and reserve verified parking spaces across Dhaka in real-time. Book hourly or monthly parking with instant digital confirmation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
