export async function login(identifier: string, password: string, rememberMe: boolean) {
  const res = await fetch("http://localhost:5103/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, rememberMe }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }

  return res.json() as Promise<{ token: string; expiresAt: string }>;
}
