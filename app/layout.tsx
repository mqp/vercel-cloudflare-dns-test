import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DNS Test Bench",
  description: "A tiny Next.js app for poking at DNS resolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
