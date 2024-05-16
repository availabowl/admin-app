import { NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { uploadPhoto } from "@/lib/s3";
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const dhId = formData.get('dhId') as string;

        const dhName = formData.get('dhName') as string;
        const dhPhoto = formData.get('dhPhoto') as File;

        if (!dhId) return NextResponse.json({error: "Missing dining hall or school ID"}, { status: 500 });

        let data = {
            dhname: dhName,
            ...(dhPhoto.size > 0 && { dhphoto: `${uuid()}.jpeg`}),
            isdraft: formData.get('isDraft') === 'true',
            is_archived: formData.get('is_archived') === 'true',
        };

        const updateDb = await prisma.dhs.update({
            where: {
                id: dhId
            },
            data
        });

        if (dhPhoto.size > 0) await uploadPhoto(dhPhoto, data.dhphoto!, updateDb?.dhphoto || '', 800, 600);
        return NextResponse.json({...updateDb, success: true});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500});
    }
}