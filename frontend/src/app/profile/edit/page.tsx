"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch(`http://localhost:5103/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, bio, location }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setMessage("Profile updated!");
      // Redirect back to profile view after short delay
      setTimeout(() => router.push("/profile"), 1000);
    } catch (err) {
      console.error(err);
      setError("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-[var(--gray-soft)] text-black flex justify-center py-10">
      <div className="w-full max-w-xl bg-[var(--foreground)] p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        {error && <p className="mb-4 text-[var(--red-main)]">{error}</p>}
        {message && <p className="mb-4 text-[var(--green-dark)]">{message}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-[var(--gray-soft)] rounded-lg p-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--gray-soft)] rounded-lg p-2 text-black"
                required
            />
          </div>


          <div>
            <label className="block font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-[var(--gray-soft)] rounded-lg p-2 h-24 text-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-[var(--gray-soft)] rounded-lg p-2 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-[var(--green-main)] text-[var(--background)] rounded-lg hover:bg-[var(--green-dark)] transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
