import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { deletePhoto } from '@/lib/s3';

export async function DELETE(request: NextRequest) {
    const formData = await request.json();
    if (!formData.dhId) return NextResponse.json({error: "A dining hall ID is required"}, { status: 500 });

    try {
        const dhId = formData.dhId;
        const deleteDhFromDb = await prisma.dhs.delete({
            where: {
                id: dhId
            }
        });

        if (deleteDhFromDb.dhphoto) {
            const deletedAsset = await deletePhoto(deleteDhFromDb.dhphoto);
            return NextResponse.json({success: deleteDhFromDb !== null && deletedAsset});
        }

        return NextResponse.json({success: deleteDhFromDb !== null});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500 });
    }
 }