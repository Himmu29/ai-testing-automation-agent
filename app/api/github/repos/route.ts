import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map<string, {data: any, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get('gh_token')?.value;

    if(!token){
        return NextResponse.json(JSON.stringify({error:'Github token not found'}),{status:401});
    }

    // Check cache first
    const cacheKey = `repos_${token}`;
    const cached = cache.get(cacheKey);
    if(cached && Date.now() - cached.timestamp < CACHE_DURATION){
        console.log('Returning cached repos');
        return NextResponse.json(cached.data);
    }

    const allRespo=[];
    let page = 1;

    while(true){
        const result = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`,{
            headers:{
                Authorization:`Bearer ${token}`,
                Accept:'application/vnd.github+json'
            }
        }
    )

    if(!result.ok){
        const errorData = await result.json().catch(() => ({}));
        console.error('GitHub API error:', result.status, result.statusText, errorData);
        return NextResponse.json({error:`GitHub API error: ${result.statusText}`, details: errorData},{status: result.status});
    }

    const respos = await result.json();
    if(!respos.length) break;
    allRespo.push(...respos);
    page++;
    }

    const mappedRepos = allRespo.map(r=>({
        id:r.id,
        name:r.name,
        full_name:r.full_name,
        private_:r.private,
        html_url:r.html_url,
        description:r.description,
        updated_at:r.updated_at,
        language:r.language,
        default_branch:r.default_branch,
        owner:r.owner.login,
    }));

    // Cache the result
    cache.set(cacheKey, {data: mappedRepos, timestamp: Date.now()});

    return NextResponse.json(mappedRepos);
}