import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalStore — Tealium Demo",
  description: "Frontend event tracking demonstration",
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