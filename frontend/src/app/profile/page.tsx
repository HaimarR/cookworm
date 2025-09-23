"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5103/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, [router]);

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
            {/* Username + Edit Button */}
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{username}</h1>
              <button
                onClick={() => router.push("/profile/edit")}
                className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
              >
                Edit Profile
              </button>
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

            {/* Bio */}
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
