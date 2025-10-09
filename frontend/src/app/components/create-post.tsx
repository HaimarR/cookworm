"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function NewPostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (e.g., JPG, PNG, GIF).");
      e.target.value = "";
      return;
    }

    setPhotos(files);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotos(null);
    setPreviewUrl(null);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Convert cropped area to blob
  const getCroppedImage = useCallback(async () => {
    if (!previewUrl || !croppedAreaPixels) return null;

    const image = await createImage(previewUrl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }, [previewUrl, croppedAreaPixels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photos || photos.length === 0) return;

    setLoading(true);

    const blob = await getCroppedImage();
    if (!blob) {
      alert("Error processing cropped image.");
      setLoading(false);
      return;
    }

    const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    const dt = new DataTransfer();
    dt.items.add(croppedFile);
    const newFileList = dt.files;
    setPhotos(newFileList);

    const formData = new FormData();
    formData.append("caption", caption);
    Array.from(newFileList).forEach((file) => formData.append("photos", file));

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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-2xl w-[800px] max-h-[95vh] overflow-auto shadow-2xl">
        <h2 className="text-2xl font-semibold mb-3 text-center">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
          {/* Image upload / preview */}
          {previewUrl ? (
            <div className="relative w-[600px] h-[600px] rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={false}
              />

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-[600px] h-[600px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center text-center">
              <label
                htmlFor="photo-upload"
                className="cursor-pointer text-[var(--green-main)] hover:underline text-lg"
              >
                Click to upload a photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Only one image allowed (JPG, PNG, etc.)
              </p>
            </div>
          )}

          {/* Zoom bar */}
          {previewUrl && (
            <div className="flex flex-col items-center w-100">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-1/2 accent-[var(--green-main)]"
              />
            </div>
          )}

          {/* Caption input */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-[600px] h-[50px] border rounded p-3 text-gray-700 focus:outline-[var(--green-main)]"
            rows={3}
          />

          {/* Buttons */}
          <div className="flex gap-4 w-[600px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--green-main)] text-white py-3 rounded-lg hover:bg-[var(--green-dark)] transition font-medium"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Helper to load image from URL */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
