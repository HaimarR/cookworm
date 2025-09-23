"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { username: routeUsername } = useParams<{ username: string }>();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loggedInUsername = localStorage.getItem("username");

    if (!token || !userId) {
      router.push("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        let res;

        // If visiting your own profile → fetch private data by ID (auth required)
        if (routeUsername === loggedInUsername) {
          res = await fetch(`http://localhost:5103/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Visiting someone else → fetch public profile by username
          res = await fetch(
            `http://localhost:5103/api/users/by-username/${routeUsername}`
          );
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUsername(data.username || "unknown_user");
        setBio(data.bio || "");
        setLocation(data.location || "");
      } catch (err) {
        console.error(err);
        setBio("Error loading bio.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, routeUsername]);

  const loggedInUsername =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const isOwnProfile = routeUsername === loggedInUsername;

  return (
    <main className="min-h-screen bg-[var(--gray-soft)] text-black flex justify-center py-10">
      <div className="w-full max-w-4xl px-4">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
          {/* Avatar */}
          <img
            src="https://via.placeholder.com/150"
            alt="Profile avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />

          {/* User Info */}
          <div className="flex-1">
            {/* username + Edit/Follow Button */}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{username}</h1>
              {isOwnProfile ? (
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => alert("Follow logic goes here")}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
                >
                  Follow
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <span>
                <strong>0</strong> posts
              </span>
              <span>
                <strong>0</strong> followers
              </span>
              <span>
                <strong>0</strong> following
              </span>
            </div>

            {/* bio */}
            <div>
              <p className="font-semibold">{location}</p>
              <p className="text-sm">{loading ? "Loading..." : bio}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-200 aspect-square">
              <img
                src={`https://source.unsplash.com/400x400/?food&sig=${i}`}
                alt={`Post ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
