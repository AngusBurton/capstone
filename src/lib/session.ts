import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(session) },
  });

  console.log("XXXXXXXXXXXXXXX", user)

  return user;
}
