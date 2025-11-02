"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];

      // Optional: validate MIME type
      if (!selected.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) throw new Error("You must be logged in to create a post.");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content.replaceAll('<script>', '').replaceAll('</script>', '').replaceAll('javacript:', ''));
      formData.append("authorId", String(user.id));
      if (file) formData.append("image", file);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

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
        <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 rounded bg-neutral-800 text-white"
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="p-2 rounded bg-neutral-800 text-white"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />

        {preview && (
          <img
            src={preview}
            alt="Image preview"
            className="mt-2 max-h-60 rounded border border-gray-600"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold cursor-pointer"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
