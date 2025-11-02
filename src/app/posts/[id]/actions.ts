"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePost(postId: number, csrfToken: string) {
  console.log("Received CSRF token (demo):", csrfToken);
  await prisma.post.delete({
    where: { id: postId },
  });
  revalidatePath("/");
}

export async function addComment(postId: number, authorId: number, content: string) {
  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
  });

  revalidatePath(`/posts/${postId}`); // refresh post page
}
