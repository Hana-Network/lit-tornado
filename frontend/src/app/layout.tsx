import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lit🔥Tornado🌪",
  description:
    "a mixer app like Tornado Cash but using Lit Protocol - achieving confidential transactions without zero-knowledge proofs!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className="">{children}</body>
    </html>
  );
}
