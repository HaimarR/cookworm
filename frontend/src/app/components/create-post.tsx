"use client";

import { useState } from "react";

export default function NewPostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setPhotos(files);

    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleRemovePhotos = () => {
    setPhotos(null);
    setPreviewUrls([]);
  };

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
          {/* Image upload / preview section */}
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            {previewUrls.length > 0 ? (
              <div className="relative w-full flex flex-wrap justify-center gap-2">
                {previewUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                ))}
                <button
                  type="button"
                  onClick={handleRemovePhotos}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-[var(--green-main)] hover:underline"
                >
                  Click to upload photos
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple images
                </p>
              </>
            )}
          </div>

          {/* Caption input */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full border rounded p-2"
            rows={3}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--green-main)] text-white py-2 rounded hover:bg-[var(--green-dark)] transition"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
