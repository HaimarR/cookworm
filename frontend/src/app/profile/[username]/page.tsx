"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProfileList, { type UserProfile } from "../../components/profile-list";
import PostCard from "../../components/post-card";

type Post = {
  id: number;
  caption: string;
  imageUrl: string;
  createdAt: string;
  username: string;
};

export default function Profile() {
  const router = useRouter();
  const { username: routeUsername } = useParams<{ username: string }>();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // panel state
  const [panelOpen, setPanelOpen] = useState<null | "followers" | "following">(null);
  const [panelItems, setPanelItems] = useState<UserProfile[]>([]);

  // posts state
  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/auth");
      return;
    }

    const fetchAll = async () => {
      try {
        // Public profile by username
        const res = await fetch(`http://localhost:5103/api/profile/${encodeURIComponent(routeUsername)}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setUsername(data.username || "unknown_user");
        setBio(data.bio || "");
        setLocation(data.location || "");

        // Stats
        const statsRes = await fetch(
          `http://localhost:5103/api/profile/${encodeURIComponent(routeUsername)}/stats`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setFollowersCount(stats.followersCount);
          setFollowingCount(stats.followingCount);
          setIsFollowing(stats.isFollowing);
        }

        // Fetch posts
        const postsRes = await fetch(`http://localhost:5103/api/users/${encodeURIComponent(routeUsername)}/posts`);
        if (postsRes.ok) {
          const userPosts = await postsRes.json();
          setPosts(userPosts);
        }
      } catch (err) {
        console.error(err);
        setBio("Error loading bio.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router, routeUsername]);

  const loggedInUsername =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const isOwnProfile = routeUsername === loggedInUsername;

  async function handleToggleFollow() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(routeUsername)}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh stats
      const statsRes = await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(routeUsername)}/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setFollowersCount(stats.followersCount);
        setFollowingCount(stats.isFollowing);
        setIsFollowing(stats.isFollowing);
      }
    } catch (err) {
      console.error("Error following/unfollowing", err);
    }
  }

  async function openList(kind: "followers" | "following") {
    try {
      const res = await fetch(
        `http://localhost:5103/api/profile/${encodeURIComponent(routeUsername)}/${kind}`
      );
      if (res.ok) {
        const items: UserProfile[] = await res.json();
        setPanelItems(items);
        setPanelOpen(kind);
      }
    } catch (err) {
      console.error(`Failed to load ${kind}`, err);
    }
  }

  function closePanel() {
    setPanelOpen(null);
    setPanelItems([]);
  }

  function handleSelectProfile(p: UserProfile) {
    window.location.href = `/profile/${p.username}`;
    closePanel();
  }

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
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{username}</h1>
              {isOwnProfile ? (
                <button
                  onClick={() => router.push(`/profile/${routeUsername}/edit`)}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-[var(--green-soft)] hover:bg-opacity-50 transition"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            <div className="flex gap-6 mb-4">
              <span>
                <strong>{posts.length}</strong> posts
              </span>

              <button
                onClick={() => openList("followers")}
                className="text-left hover:underline"
                title="View followers"
              >
                <strong>{followersCount}</strong> followers
              </button>

              <button
                onClick={() => openList("following")}
                className="text-left hover:underline"
                title="View following"
              >
                <strong>{followingCount}</strong> following
              </button>
            </div>

            <div>
              <p className="font-semibold">{location}</p>
              <p className="text-sm">{loading ? "Loading..." : bio}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-200 aspect-square cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={`http://localhost:5103${post.imageUrl}`}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <PostCard post={selectedPost} />
            </div>
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setSelectedPost(null)}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {panelOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-black text-lg">
              {panelOpen === "followers" ? "Followers" : "Following"}
            </h2>
            <button onClick={closePanel} className="text-black">✕</button>
          </div>

          <ProfileList profiles={panelItems} onSelect={handleSelectProfile} />
        </div>
      )}
    </main>
  );
}
