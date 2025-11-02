import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch posts from the database, newest first
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#0a0a0a] text-white">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold">List of all posts</h1>

        <ul className="space-y-4 w-full">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="block p-4 border rounded-lg bg-neutral-900 hover:bg-neutral-800"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-300">{post.content}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="flex items-center gap-2">© 2025 Angus Burton</p>
      </footer>
    </div>
  );
}
