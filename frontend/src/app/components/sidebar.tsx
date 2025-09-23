"use client";

import { useRouter } from "next/navigation";
import { Home as HomeIcon, BookOpen, User, Search } from "lucide-react";
import { useState } from "react";
import SearchPanel from "./search-panel";

export function Sidebar() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("expiresAt");
    window.location.href = "/auth";
  };

  return (
    <aside className="w-60 h-screen bg-[var(--green-main)] flex flex-col px-6 py-6 sticky top-0">
      {/* Title */}
      <button onClick={() => router.push("/")} className="mb-6">
        <h1 className="text-2xl font-bold text-left text-[var(--background)]">
          Cookworm
        </h1>
      </button>

      {/* Nav Sections */}
      <nav className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)] hover:bg-opacity-5 rounded-lg px-2 py-2 transition"
        >
          <HomeIcon size={20} />
          <h2 className="text-lg font-semibold">Home</h2>
        </button>

        <button
          onClick={() => router.push("/recipes")}
          className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)] hover:bg-opacity-5 rounded-lg px-2 py-2 transition"
        >
          <BookOpen size={20} />
          <h2 className="text-lg font-semibold">Recipes</h2>
        </button>

        {/* Search Button */}
        <button
          onClick={() => setOpenSearch(true)}
          className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)] hover:bg-opacity-5 rounded-lg px-2 py-2 transition"
        >
          <Search size={20} />
          <h2 className="text-lg font-semibold">Search</h2>
        </button>

        <button
          onClick={() => {
              const username = localStorage.getItem("username");
              if (username) {
              router.push(`/profile/${username}`);
              }
          }}
          className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)] hover:bg-opacity-5 rounded-lg px-2 py-2 transition"
          >
          <User size={20} />
          <h2 className="text-lg font-semibold">Profile</h2>
        </button>



        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 text-[var(--background)] hover:bg-[var(--green-soft)] hover:bg-opacity-5 rounded-lg px-2 py-2 transition"
        >
          <User size={20} />
          <h2 className="text-lg font-semibold">Sign Out</h2>
        </button>
      </nav>

      {openSearch && <SearchPanel onClose={() => setOpenSearch(false)} />}
    </aside>
  );
}
