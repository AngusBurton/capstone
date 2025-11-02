// pages/api/auth/login.ts (or app/api/auth/login/route.ts)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set cookie
  const cookie = serialize("session", String(user.id), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });

  // Return user object
  return NextResponse.json(
    { user: { id: user.id, username: user.username } },
    { headers: { "Set-Cookie": cookie } }
  );
}
