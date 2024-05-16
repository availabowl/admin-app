import { NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { uploadPhoto } from "@/lib/s3";
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const vendorId = formData.get('vendorId') as string;
        const vendorIcon = formData.get('newIcon') as File;
        const vendorPhoto = formData.get('newPhoto') as File;

        if (!vendorId) {
            return NextResponse.json({error: "Missing vendor ID"}, { status: 500 });
        }

        // PostgreSQL write back/update query to database
        let dataWriteBackToDb = {
            vendorname: formData.get('vendorname'),
            vendorcategory: formData.get('vendorcategory'),
            overridevendoricon: formData.get('overridevendoricon') === 'true',
            overridevendorphoto: formData.get('overridevendorphoto') === 'true',
            isdraft: formData.get('isdraft') === 'true',
            ...(vendorIcon.size > 0 && {vendoricon: `${uuid()}.jpeg`}),
            ...(vendorPhoto.size > 0 && {vendorphoto: `${uuid()}.jpeg`}),
        } as any;

        // Write back to database
        const updateDb = await prisma.vendors.update({
            where: {
                id: vendorId
            },
            data: dataWriteBackToDb
        });

        if (vendorIcon.size > 0) { // Check + upload new vendor icon file
            await uploadPhoto(vendorIcon, dataWriteBackToDb.vendoricon, formData.get('previousIconPath') as string, 90, 90);
        }
        
        if (vendorPhoto.size > 0) { // Check + upload new vendor photo file
            await uploadPhoto(vendorPhoto, dataWriteBackToDb.vendorphoto, formData.get('previousPhotoPath') as string, 800, 600);
        }
        
        return NextResponse.json({...updateDb, success: true});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, { status: 500});
    }
};