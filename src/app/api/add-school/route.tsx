import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { ObjectId } from 'bson';
import { Prisma } from '@prisma/client';
import { uploadPhoto } from "@/lib/s3";
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    if (!formData.get('schoolname')) {
        return NextResponse.json({error: "A school name is required"}, { status: 500 });
    }

    try {
        const schoolIcon = formData.get('schoolicon') as File;

        let dataWriteBackToDb = {
            id: new ObjectId().toString(),
            schoolname: formData.get('schoolname') as string,
            schoolstate: formData.get('schoolstate') as string || '',
            schoolphoto: schoolIcon.size > 0 ? `${uuid()}.jpeg` : '', // Temporary UUID value that will be modified to full .jpeg path
            isdraft: true
        } as any;

        const postToDb = await prisma.schools.create({
            data: dataWriteBackToDb
        });

        if (schoolIcon.size > 0) {
            await uploadPhoto(schoolIcon, dataWriteBackToDb.schoolphoto, '', 90, 90);
        }

        return NextResponse.json({success: true, schoolId: postToDb.id});
    } catch (e) {
        console.error(e)
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({error: e.message}, { status: 500 });
        }
        return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
    }
};