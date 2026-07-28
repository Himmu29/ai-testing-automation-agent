import { db, repositories } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    repoId,
    userId,
    name,
    full_name,
    private_,
    html_url,
    description,
    language,
    defaultBranch,
    owner,
  } = await req.json();

  const result = await db.insert(repositories).values({
    repoId,
    userId,
    name,
    fullName: full_name,
    private: private_?1:0,
    htmlUrl: html_url,
    description,
    language,
    defaultBranch:defaultBranch,
    owner,
  }).returning();

  return NextResponse.json(result[0]);
}



export async function GET(req:NextRequest){
  const {searchParams} = new URL(req.url);

  const userIdStr = searchParams.get("userId");
  if (!userIdStr || userIdStr === "undefined" || userIdStr === "null") {
    return NextResponse.json([]);
  }

  const userId = Number(userIdStr);
  if (isNaN(userId)) {
    return NextResponse.json([]);
  }

  const result = await db.select().from(repositories).where(
    eq(repositories.userId, userId)
  )

  return  NextResponse.json(result);
}