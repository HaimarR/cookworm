import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarWrapper } from "./components/sidebar-wrapper";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const bodyClass = `${geistSans.variable} ${geistMono.variable} antialiased`;

export const metadata: Metadata = {
  title: "Cookworm",
  description: "Your cooking social app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bodyClass} min-h-screen flex bg-[var(--gray-soft)] text-black`}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
