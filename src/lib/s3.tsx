import sharp from "sharp";
import { S3, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3({
    credentials: {
        secretAccessKey: process.env.NEXT_PUBLIC_BUCKETEER_AWS_SECRET_ACCESS_KEY!,
        accessKeyId: process.env.NEXT_PUBLIC_BUCKETEER_AWS_ACCESS_KEY_ID!
    }
});

export const deletePhoto = async (path: string) => {
    try {
        const deleteObjectParams = {
            Bucket: process.env.NEXT_PUBLIC_BUCKETEER_BUCKET_NAME,
            Key: `public/${path}`
        }
        await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
        return true;

    } catch (e) {
        console.error(e);
        return false;
    }
};

export const uploadPhoto = async (photo: File, photoPathUUID: string, previousImagePath: string, width: number, height: number) => {
    try {
        const buffer = Buffer.from(await photo.arrayBuffer());
        const output = await sharp(buffer).resize({
            fit: sharp.fit.cover,
            width: width,
            height: height
        }).jpeg({quality: 95}).toBuffer();
    
        const params = {
            Bucket: process.env.NEXT_PUBLIC_BUCKETEER_BUCKET_NAME,
            Key: `public/${photoPathUUID}`,
            Body: output,
            ContentType: 'image/jpeg'
        };
    
        if (previousImagePath) {
            const deleteObjectParams = {
                Bucket: process.env.NEXT_PUBLIC_BUCKETEER_BUCKET_NAME,
                Key: `public/${previousImagePath}`
            }
            await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
        }
        const result = await s3Client.send(new PutObjectCommand(params)); // Upload file
        if (result.$metadata.httpStatusCode !== 200) {
            throw new Error("Failed to upload vendor icon");
        }
        return `${photoPathUUID}`;
    } catch (err) {
        console.log(err)
        throw new Error("Failed to process vendor icon for S3")
    }
};