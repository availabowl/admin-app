import { NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { uploadPhoto } from "@/lib/s3";
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const schoolId = formData.get('schoolId') as string;
        const schoolName = formData.get('schoolName');

        const schoolIcon = formData.get('newIcon') as File;
        const schoolBanner = formData.get('newPhoto') as File;

        if (!schoolId) return NextResponse.json({error: "Missing school ID"}, { status: 500 });

        let dataWriteBackToDb = {
            schoolname: schoolName,
            schoolstate: formData.get('schoolState'),
            ...(schoolIcon.size > 0 && {schoolphoto: `${uuid()}.jpeg`}),
            ...(schoolBanner.size > 0 && {schoolimage: `${uuid()}.jpeg`}),
            isdraft: formData.get('isDraft') === 'true',
        } as any;

        if (schoolIcon.size > 0) await uploadPhoto(schoolIcon, dataWriteBackToDb.schoolphoto, formData.get('previousIconPath') as string, 90, 90);
        if (schoolBanner.size > 0)  await uploadPhoto(schoolBanner, dataWriteBackToDb.schoolimage, formData.get('previousPhotoPath') as string, 1000, 750);

        // Write back to database
         const updateDb = await prisma.schools.update({
            where: {
                id: schoolId
            },
            data: dataWriteBackToDb
        });

        return NextResponse.json({...updateDb, success: true});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500 });
    }
}