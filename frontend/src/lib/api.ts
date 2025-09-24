const BASE = "http://localhost:5103/api";

export async function followUser(username: string, token: string) {
  await fetch(`${BASE}/profile/${encodeURIComponent(username)}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function unfollowUser(username: string, token: string) {
  await fetch(`${BASE}/profile/${encodeURIComponent(username)}/unfollow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getFollowStats(username: string, token?: string) {
  const res = await fetch(
    `${BASE}/profile/${encodeURIComponent(username)}/stats`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!res.ok) throw new Error("Failed to fetch follow stats");
  return res.json();
}

export async function getProfile(username: string) {
  const res = await fetch(`${BASE}/profile/${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}
export async function getFollowers(username: string) {
  const res = await fetch(
    `${BASE}/profile/${encodeURIComponent(username)}/followers`
  );
  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
}
export async function getFollowing(username: string) {
  const res = await fetch(
    `${BASE}/profile/${encodeURIComponent(username)}/following`
  );
  if (!res.ok) throw new Error("Failed to fetch following");
  return res.json();
}
