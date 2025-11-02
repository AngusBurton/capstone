// app/posts/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import PostPageClient from "./PostPagesClient";

type PostPageProps = {
  params: { id: string };
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { 
      author: true,
      comments: { 
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    return (
      <div className="min-h-screen p-8 bg-[#0a0a0a] text-white flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <a href="/" className="text-blue-400 hover:underline">
          ← Back to posts
        </a>
      </div>
    );
  }

  return <PostPageClient post={post} />;
}
