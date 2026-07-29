import { db } from "@/db";
import { TestCasesTable, repositories } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchparams = new URL(req.url).searchParams;
    const repoId = searchparams.get('repoId');

    if (!repoId) {
        return NextResponse.json({ error: 'repoId is required' }, { status: 400 });
    }

    // 1. Try finding test cases matching repoId directly (e.g. "1048906272")
    let result = await db.select().from(TestCasesTable).where(eq(TestCasesTable.repoId, repoId));

    // 2. Fallback: if no test cases found, check if test cases were saved under the repository's internal DB id
    if (result.length === 0 && !isNaN(Number(repoId))) {
        const repoRows = await db.select().from(repositories).where(eq(repositories.repoId, Number(repoId)));
        if (repoRows.length > 0) {
            const dbIdStr = repoRows[0].id.toString();
            result = await db.select().from(TestCasesTable).where(eq(TestCasesTable.repoId, dbIdStr));
        }
    }

    // 3. Fallback reversed: if repoId passed was internal DB id (e.g. "1"), check by GitHub repoId
    if (result.length === 0 && !isNaN(Number(repoId))) {
        const repoRows = await db.select().from(repositories).where(eq(repositories.id, Number(repoId)));
        if (repoRows.length > 0) {
            const ghRepoIdStr = repoRows[0].repoId.toString();
            result = await db.select().from(TestCasesTable).where(eq(TestCasesTable.repoId, ghRepoIdStr));
        }
    }

    return NextResponse.json(result);
}