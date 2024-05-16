import { NextResponse } from 'next/server'
import { prisma } from '@/lib/Prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const res = await prisma.dhs.findMany({
        where: {
            schoolid: params.id
        },
        select: {
            id: true,
            dhname: true,
            dhphoto: true,
            numreviews: true,
            averagerating: true,
            uriencodedname: true,
            isdraft: true,
            schoolid: true,
            num_vendors: true,
            is_archived: true
        }
    });
    return NextResponse.json(res);
};