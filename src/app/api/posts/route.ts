import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const authorId = Number(formData.get("authorId"));
    const file = formData.get("image") as File | null;

    if (!title || !content || !authorId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    let imagePath: string | null = null;

    if (file) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadsDir, fileName);

      // Convert File to ArrayBuffer then to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        image: imagePath,
      },
    });

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
