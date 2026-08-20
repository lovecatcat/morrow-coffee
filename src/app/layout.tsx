import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morrow Coffee — Better Coffee, Made Simple",
  description:
    "Thoughtful coffee gear selected for your taste, budget, and daily ritual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
