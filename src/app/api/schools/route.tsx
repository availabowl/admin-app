import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/Prisma';

export async function GET(request: NextRequest) {
    const start = request.nextUrl.searchParams.get("start") || 0;
    const result = await prisma.$queryRawUnsafe(`
    WITH constants (start_index, limit_value, total, backend_uri) as (
        values ($1, 5, (SELECT COUNT(*) FROM schools), '${process.env.NEXT_PUBLIC_BACKEND}')
    )
    SELECT
        total :: INTEGER as count,
        CASE
            WHEN start_index > 0 THEN
                CASE
                    WHEN start_index - limit_value < 0 THEN CONCAT(backend_uri, '/api/school?start=0&limit=', start_index)
                    WHEN start_index - limit_value >= 0 THEN CONCAT(backend_uri, '/api/school?start=', (start_index - limit_value), '&limit=', (start_index - 1))
                    ELSE NULL END
            ELSE NULL
        END AS prev,
        CASE
            WHEN ((start_index + (limit_value * 2)) < total) THEN CONCAT(backend_uri, '/api/school?start=', (start_index+limit_value), '&limit=', limit_value)
            ELSE
                CASE
                    WHEN ((start_index+limit_value) < total) THEN CONCAT(backend_uri, '/api/school?start=', (start_index+limit_value), '&limit=', (total - (start_index+limit_value)))
                    ELSE NULL END 
        END AS next,
        (SELECT json_agg(t.*) FROM (
            SELECT
            id,
            schoolname,
            schoolstate,
            isdraft,
            schoolphoto,
            averagerating,
            numreviews,
            num_dhs,
            uriencodedname
            FROM schools
            OFFSET start_index
            LIMIT limit_value
        ) AS t) AS schools
        FROM constants;
    `, Number(start));
    return NextResponse.json((result as any)[0]);
};
