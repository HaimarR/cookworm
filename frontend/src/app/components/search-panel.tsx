"use client";

import { useEffect, useState } from "react";
import ProfileList, { type UserProfile } from "../components/profile-list";

export default function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<UserProfile[]>([]);

  // Load recents from localStorage + refresh counts
  useEffect(() => {
    const stored = localStorage.getItem("recentProfiles");
    if (!stored) return;

    const parsed: UserProfile[] = JSON.parse(stored);

    Promise.all(
      parsed.map(async (p) => {
        try {
          const res = await fetch(
            `http://localhost:5103/api/profile/${encodeURIComponent(
              p.username
            )}/stats`
          );
          if (res.ok) {
            const stats = await res.json();
            return {
              ...p,
              followers: stats.followersCount,
              isFollowing: stats.isFollowing,
            };
          }
        } catch (err) {
          console.error("Failed to refresh followers for", p.username, err);
        }
        return p; // fallback to stored version
      })
    ).then((updated) => setRecentProfiles(updated));
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
  const handleSelectProfile = (profile: UserProfile) => {
    const updated = [
      profile,
      ...recentProfiles.filter((p) => p.id !== profile.id),
    ].slice(0, 5);
    setRecentProfiles(updated);
    localStorage.setItem("recentProfiles", JSON.stringify(updated));

    window.location.href = `/profile/${profile.username}`;
    onClose();
  };

  const displayList = query.trim() ? results : recentProfiles;

  return (
    <div className="fixed left-60 top-0 h-full w-80 bg-white border-r shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-black text-lg">Search</h2>
        <button onClick={onClose} className="text-black">
          ✕
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded p-2 mb-4 text-black"
      />

      {displayList.length === 0 ? (
        <p className="text-black text-sm">
          {query.trim() ? "No users found." : "No recent profiles."}
        </p>
      ) : (
        <ProfileList profiles={displayList} onSelect={handleSelectProfile} />
      )}
    </div>
  );
}
