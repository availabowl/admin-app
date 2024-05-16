import { NextResponse } from 'next/server'
import { prisma } from '@/lib/Prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const res = await prisma.vendors.findMany({
        where: {
            dhid: params.id
        },
        select: {
            id: true,
            vendoricon: true,
            vendorname: true,
            uriencodedname: true,
            vendorcategory: true,
            overridevendoricon: true,
            overridevendorphoto: true,
            schoolid: true,
            dhid: true,
            averagerating: true,
            numreviews: true,
            isdraft: true
            
        }
    });
    return NextResponse.json(res);
};