import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/Prisma';

export async function GET(request: NextRequest) {
    const query = decodeURIComponent(request.nextUrl.searchParams.get("search") || '')
    if (query.length === 0) return NextResponse.json([]);
    
    const result = await prisma.$queryRaw`SELECT id, schoolname, schoolphoto, averagerating, numreviews, isdraft, schoolstate FROM schools WHERE ts @@ plainto_tsquery('english', ${query});`;
    return NextResponse.json(result);
};
