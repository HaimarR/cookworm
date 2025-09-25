"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "./components/post-card";

type Post = {
  id: number;
  username: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth check + fetch posts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      router.push("/auth");
      return;
    }

    const fetchFeed = async () => {
      try {
        const res = await fetch(`http://localhost:5103/api/users/${encodeURIComponent(username)}/feed`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Error loading feed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [router]);


  return (
    <main className="min-h-screen bg-[var(--gray-soft)] text-black flex">
      {/* Main content */}
      <div className="flex-1 flex justify-center mt-6 gap-8 px-4">
        {/* Feed */}
        <section className="flex-1 max-w-lg">
          {loading ? (
            <p className="text-center text-gray-500">Loading feed...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet</p>
          ) : (
            posts.map((post) => <PostCard className="mb-6" key={post.id} post={post} />)
          )}
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
