"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser(); // update Navbar dynamically
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();

      // Update UserContext with logged-in user
      setUser({ id: data.user.id, username: data.user.username });

      // Redirect back to homepage
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-[#0a0a0a] text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-2 rounded bg-neutral-800 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded bg-neutral-800 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link href="/signup" className="text-blue-400 hover:underline">
          Sign Up →
        </Link>
      </form>
    </div>
  );
}
