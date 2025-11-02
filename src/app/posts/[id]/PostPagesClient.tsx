"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { addComment, deletePost } from "./actions";
import { useEffect, useState } from "react";
import DOMPurify from 'isomorphic-dompurify';

type PostPageClientProps = {
  post: {
    id: number;
    title: string;
    content: string;
    author: { id: number; username: string };
    image: string;
    comments: {
      id: number;
      content: string;
      createdAt: string;
      author: { id: number; username: string };
    }[];
  };
};

export default function PostPageClient({ post }: PostPageClientProps) {
    const { user } = useUser();
    const router = useRouter();
    const [comment, setComment] = useState("");

    async function handleDelete() {
        await deletePost(post.id, "anti-csrf-token-12345");
        router.push("/");
    }

    async function handleAddComment() {
        if (!comment.trim() || !user) return;
        await addComment(post.id, user.id, comment.trim());
        setComment("");
        router.refresh(); // reload comments
    }
    
    useEffect(() => {
        let mounted = true;

        async function onMessage(event: MessageEvent) {
            console.log("Received postMessage from", event.origin, "data=", event.data);
            const data = event.data;
            if (!data || typeof data !== "object") return;

            if (data.action === "deletePost" && typeof data.postId === "number") {
                try {
                    await deletePost(data.postId, "demo-csrf-token");
                    console.log("deletePost called for id", data.postId);
                    if (mounted) router.push("/");
                } catch (err) {
                    console.error("deletePost failed", err);
                }
            }
        }

        window.addEventListener("message", onMessage, false);
        return () => {
            mounted = false;
            window.removeEventListener("message", onMessage);
        };
    }, [router]);

  return (
    <div className="min-h-screen p-8 bg-[#0a0a0a] text-white flex items-center justify-center flex-col">
        <div className="w-full max-w-3xl">
            {/* Post Header */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex justify-between items-center text-gray-400 text-sm mb-6">
                <span>By {post.author.username}</span>
                <span>{/* could add createdAt here if you include it */}</span>
            </div>

            {/* Post Content */}
            <div className="prose prose-invert max-w-none mb-8">
                <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{__html: post.content}}></p>

                {/* Render image if exists */}
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post image"
                        className="mt-4 max-w-full max-h-96 rounded-lg border border-gray-700"
                    />
                )}
            </div>

            {/* Delete Button (only author sees this) */}
            {user?.username === post.author.username && (
            <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white mb-8 cursor-pointer"
            >
                Delete Post
            </button>
            )}

            {/* Comments section */}
            <div className="w-full max-w-2xl mt-8">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
        
                {post.comments.length === 0 && (
                <p className="text-gray-500">No comments yet.</p>
                )}
        
                <ul className="space-y-4 mb-6">
                {post.comments.map((c) => (
                    <li
                    key={c.id}
                    className="border border-gray-700 rounded-lg p-3 bg-[#111]"
                    >
                    <p className="text-gray-200">{c.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        By {c.author.username} on{" "}
                        {new Date(c.createdAt).toLocaleString()}
                    </p>
                    </li>
                ))}
                </ul>
        
                {user ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none"
                        />
                    <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                        >
                        Post
                    </button>
                </div>
                ) : (
                    <p className="text-gray-500">Login to comment.</p>
                )}
            </div>
        
            <Link href="/" className="text-blue-400 hover:underline mt-8">
                ← Back to posts
            </Link>
        </div>
    </div>
  );
}
