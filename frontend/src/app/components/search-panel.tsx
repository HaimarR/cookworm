"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  username: string;
  followers: number;
};

export default function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<UserProfile[]>([]);

  // Load recents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentProfiles");
    if (stored) setRecentProfiles(JSON.parse(stored));
  }, []);

  // Search API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5103/api/users/search?username=${encodeURIComponent(
            query
          )}`
        );
        if (res.ok) {
          const data: UserProfile[] = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // Save to recents
  const handleVisit = (profile: UserProfile) => {
    const updated = [
        profile,
        ...recentProfiles.filter((p) => p.id !== profile.id),
    ].slice(0, 5);
    setRecentProfiles(updated);
    localStorage.setItem("recentProfiles", JSON.stringify(updated));

    // Redirect by username instead of id
    window.location.href = `/profile/${profile.username}`;
    onClose();
  };


  const displayList = query.trim() ? results : recentProfiles;

  return (
    <div className="fixed left-60 top-0 h-full w-80 bg-white border-r shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-black text-lg">Search</h2>
        <button onClick={onClose} className="text-black">✕</button>
      </div>

      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded p-2 mb-4 text-black"
      />

      <div className="space-y-2">
        {displayList.length === 0 && (
          <p className="text-black text-sm">
            {query.trim() ? "No users found." : "No recent profiles."}
          </p>
        )}
        {displayList.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleVisit(profile)}
            className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 text-left"
          >
            {/* Placeholder profile pic */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <span className="text-black">{profile.username}</span>
              <span className="text-sm text-black">
                {profile.followers} followers
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
