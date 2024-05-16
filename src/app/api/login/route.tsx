import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { createHash } from 'crypto';

const salt = process.env.SALT;

export async function POST(request: NextRequest) {
    const req = await request.json();
    const result = await prisma.users.findUnique({
        where: {
            username: req.username,
            password: createHash('sha256').update(req.password+salt).digest('hex')
        },
        select: {
            email: true,
            imageurl: true
        }
    });
    return NextResponse.json(result);
};
