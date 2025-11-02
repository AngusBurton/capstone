import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  if (!session) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: Number(session) },
  });

  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { id: user.id, username: user.username } });
}
