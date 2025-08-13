import { DEPARTMENTS } from "zs-crm-common";
import { prisma } from "../../../libs/prisma";;
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../../../libs/awsS3Client";

export const getUploadUrlService = async (fileKey: string, fileType: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return uploadUrl;
}

export const uploadDrawingService = async (drawing_url: string, title: string, version: string, deal_id: string, author: any): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const admins = await tx.user.findMany({
            where: {
                department: DEPARTMENTS[1],
            }
        });
        await tx.drawing.create({
            data: {
                drawing_url: drawing_url,
                title: title,
                version: version,
                deal_id: deal_id,
                uploaded_at: new Date(),
            }
        });
        const notification = await tx.notification.create({
            data: {
                message: `Drawing uploaded by ${author.name}. Kindly review and approve when you have a moment.`,
                title: "Drawing uploaded",
                type: "drawing_uploaded",
                deal_id: deal_id,
                send_at: null
            },
            select: {
                id: true
            }
        });
        await tx.recipient.createMany({
            data: admins.map((admin) => ({
                notification_id: notification.id,
                user_id: admin.id
            }))
        })
    })
}