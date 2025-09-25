"use client";

import { useState, useEffect } from "react";

export type UserProfile = {
  id: string;
  username: string;
  followers: number;
  isFollowing?: boolean; // may come from backend; if not, we'll fetch it
};

type ProfileRow = UserProfile & { _fetched?: boolean }; // internal flag

export default function ProfileList({
  profiles,
  onSelect,
}: {
  profiles: UserProfile[];
  onSelect: (p: UserProfile) => void;
}) {
  const [items, setItems] = useState<ProfileRow[]>(
    profiles.map((p) => ({ ...p, _fetched: typeof p.isFollowing === "boolean" }))
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("userId") || null);
  }, []);

  // Re-hydrate when profiles prop changes
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Seed items immediately so UI renders fast
    setItems(profiles.map((p) => ({ ...p, _fetched: typeof p.isFollowing === "boolean" })));

    if (!token) return;

    const abort = new AbortController();

    (async () => {
      const hydrated = await Promise.all(
        profiles.map(async (p) => {
          // If backend already provided isFollowing, keep it
          if (typeof p.isFollowing === "boolean") return { ...p, _fetched: true };

          try {
            const res = await fetch(
              `http://localhost:5103/api/profile/${encodeURIComponent(p.username)}/stats`,
              { headers: { Authorization: `Bearer ${token}` }, signal: abort.signal }
            );
            if (!res.ok) return { ...p, _fetched: true }; // fall back (button will show "Follow")
            const stats = await res.json();
            return {
              ...p,
              followers: typeof stats.followersCount === "number" ? stats.followersCount : p.followers,
              isFollowing: !!stats.isFollowing,
              _fetched: true,
            };
          } catch {
            return { ...p, _fetched: true };
          }
        })
      );

      setItems(hydrated);
    })();

    return () => abort.abort();
  }, [profiles]);

  async function toggleFollow(p: ProfileRow) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint = p.isFollowing ? "unfollow" : "follow";
      await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(p.username)}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh stats after mutation
      const statsRes = await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(p.username)}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setItems((prev) =>
          prev.map((u) =>
            u.id === p.id
              ? {
                  ...u,
                  followers: stats.followersCount,
                  isFollowing: !!stats.isFollowing,
                  _fetched: true,
                }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Error following/unfollowing", err);
    }
  }

  if (!items?.length) {
    return <p className="text-black text-sm">No users found.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100"
        >
          {/* Left: profile info (clickable) */}
          <button
            onClick={() => onSelect(profile)}
            className="flex items-center gap-3 text-left flex-1"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="flex flex-col">
              <span className="text-black">{profile.username}</span>
              <span className="text-sm text-black">
                {profile.followers} followers
              </span>
            </div>
          </button>

          {/* Right: follow/unfollow (hidden for self). Button hidden until that row is hydrated */}
          {currentUserId !== profile.id && profile._fetched && (
            <button
              onClick={() => toggleFollow(profile)}
              className={`px-3 py-1 text-sm border rounded-lg transition ${
                profile.isFollowing
                  ? "bg-[var(--green-soft)] text-black border-gray-300 hover:opacity-90"
                  : "text-black border-gray-300 hover:bg-[var(--green-soft)]/50"
              }`}
            >
              {profile.isFollowing ? "Following" : "Follow"}
            </button>
          )}
          {/* Optional tiny placeholder while fetching */}
          {currentUserId !== profile.id && !profile._fetched && (
            <div className="h-8 w-20 rounded-lg bg-gray-200 animate-pulse" aria-hidden />
          )}
        </div>
      ))}
    </div>
  );
}
