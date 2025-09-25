"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth");

  return (
    <div className="w-full">
      {!hideSidebar && <Sidebar />}
      <main className="ml-60 min-h-screen bg-[var(--gray-soft)] text-black">
        {children}
      </main>
    </div>
  );
}
