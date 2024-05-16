import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/Prisma';
import { deletePhoto } from '@/lib/s3';

export async function DELETE(request: NextRequest) {
    const formData = await request.json();
    if (!formData.vendorId) return NextResponse.json({error: "A vendor ID is required"}, { status: 500 });

    try {
        const vendorId = formData.vendorId;
        const deleteFromDb = await prisma.vendors.delete({
            where: {
                id: vendorId
            }
        });

        let assetsDeleted = {
            vendoricon: false,
            vendorphoto: false
        };

        if (deleteFromDb.vendoricon) {
            const deletedAsset = await deletePhoto(deleteFromDb.vendoricon);
            assetsDeleted.vendoricon = deletedAsset;
        }

        if (deleteFromDb.vendorphoto) {
            const deletedAsset = await deletePhoto(deleteFromDb.vendorphoto);
            assetsDeleted.vendorphoto = deletedAsset;
        }

        return NextResponse.json({success: deleteFromDb !== null, assetsDeleted});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "Internal Server Error", success: false}, { status: 500 });
    }
 }