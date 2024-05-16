import { NextResponse } from 'next/server'
import { prisma } from '@/lib/Prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const res = await prisma.dhs.findFirst({
        where: {
            id: params.id
        },
        select: {
            id: true,
            uriencodedname: true,
            dhname: true,
            schoolid: true,
            numreviews: true,
            isdraft: true,
            dhphoto: true,
            is_archived: true
        }
    });
    return NextResponse.json(res);
};