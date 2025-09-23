export async function login(identifier: string, password: string, rememberMe: boolean) {
  const res = await fetch("http://localhost:5103/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, rememberMe }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Login failed");
  }

  // include all fields from backend response
  return res.json() as Promise<{
    token: string;
    expiresAt: string;
    userId: string;
    username: string;
    email: string;
  }>;
}


export async function register(username: string, email: string, password: string) {
  const res = await fetch("http://localhost:5103/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Registration failed");
  }

  return res.json() as Promise<{ id: string; username: string; email: string }>;
}
