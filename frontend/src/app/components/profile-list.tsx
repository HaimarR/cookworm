"use client";

import { useState, useEffect } from "react";

export type UserProfile = {
  id: string;
  username: string;
  followers: number;
  isFollowing?: boolean; // backend should include this, otherwise we'll fetch it
};

export default function ProfileList({
  profiles,
  onSelect,
}: {
  profiles: UserProfile[];
  onSelect: (p: UserProfile) => void;
}) {
  const [items, setItems] = useState<UserProfile[]>(profiles);

  useEffect(() => {
    setItems(profiles);
  }, [profiles]);

  async function toggleFollow(p: UserProfile) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint = p.isFollowing ? "unfollow" : "follow";
      await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(
          p.username
        )}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh stats for that user
      const statsRes = await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(
          p.username
        )}/stats`,
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
                  isFollowing: stats.isFollowing,
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

          {/* Right: follow/unfollow */}
          <button
            onClick={() => toggleFollow(profile)}
            className="px-3 py-1 text-black border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
          >
            {profile.isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}
