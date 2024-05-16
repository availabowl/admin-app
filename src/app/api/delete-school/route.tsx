import { prisma } from '@/lib/Prisma';
import { deletePhoto } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    const formData = await request.json();
    try {
        const schoolId = formData.schoolId
        // Prepare to delete school-only assets
        // Deleting dining hall, vendor, and post assets will be queued in Celery
        const deleteSchoolFromDb = await prisma.schools.delete({
            where: {
                id: schoolId
            }
        });

        if (deleteSchoolFromDb.schoolphoto) {
            const deletedAsset = await deletePhoto(deleteSchoolFromDb.schoolphoto);
            return NextResponse.json({success: deleteSchoolFromDb !== null, deletedAsset});
        }

        return NextResponse.json({success: deleteSchoolFromDb !== null});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500 });
    }
}