"use client";

import { useState } from "react";

export default function NewPostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photos) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    Array.from(photos).forEach((file) => {
      formData.append("photos", file);
    });

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5103/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create post");

      onClose();

      const username = localStorage.getItem("username");
      if (username) {
        window.location.href = `/`;
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(e.target.files)}
            className="w-full"
            required
          />

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border rounded p-2"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--green-main)] text-white py-2 rounded hover:bg-[var(--green-dark)] transition"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
