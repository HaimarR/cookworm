"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/auth");

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <main className="flex-1">{children}</main>
    </>
  );
}
