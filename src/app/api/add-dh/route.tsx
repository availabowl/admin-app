import { ObjectId } from "bson";
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const schoolId = formData.get('schoolId') as string;
    const dhName = formData.get('dhName') as string;

    if (!schoolId) return NextResponse.json({error: "Missing school ID"}, { status: 500 });
    if (!dhName) return NextResponse.json({error: "A dining hall name is required"}, { status: 500 });

    try {
        let dataWriteBackToDb = {
            id: new ObjectId().toString(),
            dhname: dhName as string,
            schoolid: schoolId as string,
            isdraft: true
        };

        const postToDb = await prisma.dhs.create({
            data: dataWriteBackToDb
        });
        return NextResponse.json({success: postToDb !== null, dhId: dataWriteBackToDb.id});


    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({error: e.message}, { status: 500 });
        }
        return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
    }
}