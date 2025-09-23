"use client";

import { useState, useRef, useEffect } from "react";
import { login, register } from "@/services/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // login form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // register form
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const welcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (!welcomeRef.current) return;

  const node = welcomeRef.current;

  const handleTransitionEnd = () => {
    const style = getComputedStyle(node);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const parentWidth = node.parentElement?.offsetWidth ?? 1;
    const percent = (matrix.m41 / parentWidth) * 100;

    console.log("translateX in px:", matrix.m41);
    console.log("translateX in % of parent:", percent.toFixed(2) + "%");
  };

  node.addEventListener("transitionend", handleTransitionEnd);
  return () => node.removeEventListener("transitionend", handleTransitionEnd);
}, []);



  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(identifier, password, rememberMe);

      // ✅ Save everything you’ll need later
      localStorage.setItem("token", result.token);
      localStorage.setItem("expiresAt", result.expiresAt);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("username", result.username);
      localStorage.setItem("email", result.email);

      // redirect to homepage
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(username, regEmail, regPassword);
      setIsLogin(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--gray-soft)]">
      <div className="relative w-[900px] h-[500px] overflow-hidden rounded-xl shadow-lg bg-[var(--foreground)]">
        
        {/* Login form */}
        <div
          className={`absolute top-0 left-0 w-[var(--form-width)] h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ease-in-out
          ${isLogin ? "translate-x-0" : "-translate-x-full"}`}
        >
          <h2 className="text-3xl font-bold mb-6 text-[var(--green-dark)]">
            Log In
          </h2>
          {error && isLogin && (
            <p className="mb-4 text-[var(--red-main)] bg-[var(--red-soft)] px-3 py-1 rounded">
              {error}
            </p>
          )}
          <form
            onSubmit={handleLogin}
            className="space-y-4 w-full max-w-sm flex flex-col items-center"
          >
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
            <label className="flex items-center space-x-2 text-[var(--gray-text)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
                type="submit"
                disabled={loading}
                className="bg-[var(--green-main)] text-white w-1/2 py-2 px-6 rounded hover:bg-[var(--green-dark)] disabled:opacity-50 cursor-pointer transition"
            >
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>
        </div>

        {/* Welcome panel */}
        <div
         ref={welcomeRef}
         className="absolute top-0 h-full bg-[var(--green-main)] flex flex-col items-center justify-center p-8 text-center transition-all duration-500 ease-in-out"
         style={{
             width: "var(--welcome-width)",
             left: isLogin
             ? "calc(100% - var(--welcome-width))" // align right edge to parent
             : "0", // slide to left edge of parent
         }}
        >
          <h2 className="text-3xl font-bold mb-4 text-[var(--foreground)] px-4 py-2 rounded-lg">
              Welcome!
          </h2>
          <p className="mb-6 text-[var(--foreground)] whitespace-pre-line">
              {isLogin
              ? "Don’t have an account yet?\nCreate one and join us."
              : "Already have an account?\nClick below to log in."}
          </p>
          <button
              onClick={() => setIsLogin(!isLogin)}
              className="min-w-[160px] px-6 py-2 border border-[var(--foreground)] text-[var(--foreground)] rounded hover:bg-[var(--green-dark)] hover:border-[var(--green-dark)] cursor-pointer transition"
          >
              {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>


        {/* Register form */}
        <div
          className={`absolute top-0 right-0 h-full w-[var(--form-width)] flex flex-col items-center justify-center p-8 transition-all duration-500 ease-in-out
          ${isLogin ? "translate-x-full" : "translate-x-0"}`}
        >
          <h2 className="text-3xl font-bold mb-6 text-[var(--green-dark)]">
            Create Account
          </h2>
          {error && !isLogin && (
            <p className="mb-4 text-[var(--red-main)] bg-[var(--red-soft)] px-3 py-1 rounded">
              {error}
            </p>
          )}
          <form
            onSubmit={handleRegister}
            className="space-y-4 w-full max-w-sm flex flex-col items-center"
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-[var(--green-main)] text-white py-2 px-6 rounded hover:bg-[var(--green-dark)] disabled:opacity-50 cursor-pointer transition"
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
