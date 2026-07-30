import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import {TestCasesTable} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req:NextRequest){
   const {title, description, targetRoute, expectedResult, testCaseId} = await req.json();

   const result = await db.update(TestCasesTable).set({
    title,
    description,
    targetRoute,
    expectedResult
   }).where(eq(TestCasesTable.id,testCaseId)).returning();

   return NextResponse.json(result[0]); 
}