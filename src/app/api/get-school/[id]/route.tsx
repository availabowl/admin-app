import { NextResponse } from 'next/server'
import { prisma } from '@/lib/Prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const res = await prisma.schools.findFirst({
        where: {
            id: params.id
        },
        select: {
            id: true,
            uriencodedname: true,
            schoolimage: true,
            schoolname: true,
            schoolphoto: true,
            schoolstate: true,
            isdraft: true,
            numreviews: true,
            num_dhs: true
        }
    });
    return NextResponse.json(res);
};