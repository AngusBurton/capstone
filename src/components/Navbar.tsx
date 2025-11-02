"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const { user, setUser } = useUser();

  return (
    <nav className="w-full bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">Capstone Blog</Link>

        <div className="flex space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
          <Link href="/create" className="hover:text-gray-300">Create</Link>

          {user ? (
            <button
              className="hover:text-gray-300"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                setUser(null); // dynamically update navbar
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
