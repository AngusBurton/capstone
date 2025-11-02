import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
  });

  return NextResponse.json({ message: "Logged out" }, { headers: { "Set-Cookie": cookie } });
}
