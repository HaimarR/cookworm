"use client";

import { useRouter } from "next/navigation";
import {
  Home as HomeIcon,
  BookOpen,
  User,
  Search,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import SearchPanel from "./search-panel";
import NewPostModal from "../components/create-post";

export function Sidebar() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("recentProfiles");
    window.location.href = "/auth";
  };

  const collapsed = openSearch; // ✅ collapse when search is open

  return (
    <div className="relative flex">
      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 h-screen bg-[var(--green-main)] flex flex-col px-2 py-6 transition-all duration-300 z-20
    ${collapsed ? "w-16 items-center" : "w-60 px-6"}`}
>
        {/* Title */}
        <button
          onClick={() => router.push("/")}
          className={`mb-6 ${collapsed ? "hidden" : "block"}`}
        >
          <h1 className="text-2xl font-bold text-left text-[var(--background)]">
            Cookworm
          </h1>
        </button>

        {/* Nav Sections */}
        <nav className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <HomeIcon size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">Home</h2>}
          </button>

          <button
            onClick={() => router.push("/recipes")}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <BookOpen size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">Recipes</h2>}
          </button>

          {/* Search Button */}
          <button
            onClick={() => setOpenSearch(true)}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <Search size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">Search</h2>}
          </button>

          {/* New Post Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <PlusSquare size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">New Post</h2>}
          </button>

          <button
            onClick={() => {
              const username = localStorage.getItem("username");
              if (username) {
                router.push(`/profile/${username}`);
              }
            }}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <User size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">Profile</h2>}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)]/50 rounded-lg px-2 py-2 transition"
          >
            <LogOut size={20} />
            {!collapsed && <h2 className="text-lg font-semibold">Sign Out</h2>}
          </button>
        </nav>
      </aside>

      {/* Search Panel (slides from behind sidebar) */}
      <div
        className={`absolute top-0 h-full transition-all duration-300 z-10`}
        style={{ left: collapsed ? "4rem" : "15rem" }} // match sidebar widths
      >
        <div
          className={`h-full w-72 bg-white border-none shadow-lg transform transition-transform duration-300
            ${openSearch ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SearchPanel collapsed={collapsed} onClose={() => setOpenSearch(false)} />
        </div>
      </div>

      {/* New Post Modal */}
      {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
