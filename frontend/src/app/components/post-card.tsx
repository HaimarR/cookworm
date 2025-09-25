"use client";

import { useState } from "react";

type Post = {
  id: number;
  username: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

export default function PostCard({
  post,
  className = "",
}: {
  post: Post;
  className?: string;
}) {
  return (
    <div
      className={`bg-[var(--foreground)] rounded-xl shadow-sm border border-[var(--gray-soft)] ${className}`}
    >
      <div className="flex items-center px-4 py-2 border-b border-[var(--gray-soft)]">
        <span className="font-semibold text-black">{post.username}</span>
        <span className="ml-auto text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <img
        src={`http://localhost:5103${post.imageUrl}`}
        alt={post.caption}
        className="w-full h-full object-cover"
      />

      <div className="px-4 py-3">
        <p className="text-sm text-black">
          <span className="font-semibold mr-1">{post.username}</span>
          {post.caption}
        </p>
      </div>
    </div>
  );
}

