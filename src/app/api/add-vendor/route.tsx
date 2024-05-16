import { ObjectId } from "bson";
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { v4 as uuid } from 'uuid';
import { uploadPhoto } from "@/lib/s3";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const schoolId = formData.get('schoolId') as string;
    const dhId = formData.get('dhId') as string;
    const vendorName = formData.get('vendorName') as string;

    const vendorIcon = formData.get('newIcon') as File;
    const vendorPhoto = formData.get('newPhoto') as File;

    const isDraft = formData.get('isDraft');
    const overrideVendorIcon = formData.get('overrideVendorIcon');
    const overrideVendorPhoto = formData.get('overrideVendorPhoto');
    
    if (!schoolId || !dhId || !vendorName) {
        return NextResponse.json({error: "Missing required data"}, { status: 500 });
    }

    try {
        let dataWriteBackToDb = {
            id: new ObjectId().toString(),
            vendorname: vendorName as string,
            vendoricon: vendorIcon.size > 0 ? `${uuid()}.jpeg` : '',
            vendorphoto: vendorPhoto.size > 0 ? `${uuid()}.jpeg`: '',
            schoolid: schoolId,
            dhid: dhId,
            isdraft: isDraft === 'true',
            overridevendoricon: overrideVendorIcon === 'true',
            overridevendorphoto: overrideVendorPhoto === 'true',
        };

        const postToDb = await prisma.vendors.create({
            data: dataWriteBackToDb
        });

        if (vendorIcon.size > 0) { // Check + upload new vendor icon file
            await uploadPhoto(vendorIcon, dataWriteBackToDb.vendoricon, '', 90, 90);
        }
        
        if (vendorPhoto.size > 0) { // Check + upload new vendor photo file
            await uploadPhoto(vendorPhoto, dataWriteBackToDb.vendorphoto, '', 800, 600);
        }

        return NextResponse.json({success: postToDb !== null, vendorId: dataWriteBackToDb.id});

    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError || e instanceof Prisma.PrismaClientValidationError) {
            return NextResponse.json({error: e.message}, { status: 500 });
        }
        return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
    }

}