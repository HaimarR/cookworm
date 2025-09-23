"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  const posts = [
    {
      id: 1,
      username: "foodie123",
      image: "https://source.unsplash.com/600x400/?food",
      caption: "Trying out a new pasta recipe 🍝",
    },
    {
      id: 2,
      username: "chef_life",
      image: "https://source.unsplash.com/600x400/?cooking",
      caption: "Behind the scenes in the kitchen 🔪",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--gray-soft)] text-black flex">
      {/* Main content */}
      <div className="flex-1 flex justify-center mt-6 gap-8 px-4">
        {/* Feed */}
        <section className="flex-1 max-w-lg">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[var(--foreground)] rounded-xl shadow-sm mb-6 border border-[var(--gray-soft)]"
            >
              <div className="flex items-center px-4 py-2 border-b border-[var(--gray-soft)]">
                <span className="font-semibold text-black">{post.username}</span>
              </div>
              <img src={post.image} alt="" className="w-full" />
              <div className="px-4 py-3">
                <p className="text-sm text-black">
                  <span className="font-semibold mr-1">{post.username}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Suggestions Sidebar */}
        <aside className="hidden lg:block w-72">
          <div className="bg-[var(--foreground)] p-4 rounded-xl shadow-sm border border-[var(--gray-soft)]">
            <h2 className="font-semibold mb-2 text-black">Suggestions for you</h2>
            <ul className="space-y-2 text-sm text-black">
              <li>@healthy_eats</li>
              <li>@quick_meals</li>
              <li>@chef_life</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
