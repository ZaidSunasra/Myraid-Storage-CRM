import { Assignee, DEPARTMENTS, GetDrawingOutput, SuccessResponse, UploadDrawing } from "zs-crm-common";
import { prisma } from "../../../libs/prisma";;
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../../../libs/awsS3Client";

export const getUploadUrlService = async (fileKey: string, fileType: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 30 });
    return uploadUrl;
}

export const uploadDrawingService = async ({ drawing_url, title, version, deal_id, file_size, file_type }: UploadDrawing, author: any): Promise<void> => {
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
                file_size: file_size,
                file_type: file_type,
                uploaded_by: author.id,
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

export const getDrawingsService = async (deal_id: string, author: any): Promise<GetDrawingOutput> => {
    const drawings = await prisma.drawing.findMany({
        where: {
            deal_id: deal_id,
            ...(author.department === DEPARTMENTS[0] && { status: "approved" }),
            ...(author.department === DEPARTMENTS[1] && { OR: [{ status: "approved" }, { status: "pending" }, { status: "rejected" }] }),
            ...(author.department === DEPARTMENTS[3] && { OR: [{ status: "rejected" }, { status: "pending" }, {status: "approved"}] })
        },
        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    id: true
                }
            }
        },
    });
    const grouped = {
        rejected: drawings.filter(d => d.status === "rejected"),
        pending: drawings.filter(d => d.status === "pending"),
        approved: drawings.filter(d => d.status === "approved"),
    };
    const totalDrawing = drawings.length;
    return { drawings: grouped, totalDrawing };
}

export const getDrawingByIdService = async (id: string): Promise<string | null> => {
    const drawing = await prisma.drawing.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            drawing_url: true
        }
    });
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: drawing?.drawing_url,
    });
    const viewUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })
    return viewUrl;
}

export const deleteDrawingService = async (id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const drawing = await tx.drawing.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                drawing_url: true
            }
        });
        console.log(drawing?.drawing_url)
        if (drawing?.drawing_url) {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: drawing.drawing_url,
                })
            );
        }
        await tx.drawing.delete({
            where: {
                id: parseInt(id)
            }
        });
    })
}

export const approveDrawingService = async (id: string, author: any): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const drawing = await tx.drawing.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: "approved",
                approved_at: new Date()
            },
            select: {
                deal_id: true
            }
        });
        const deal = await tx.deal.findUnique({
            where: { id: drawing.deal_id },
            select: {
                assigned_to: { select: { user_id: true } }
            }
        });
        if (deal?.assigned_to?.length) {
            const notification = await tx.notification.create({
                data: {
                    title: "Drawing approved",
                    message: `Drawing has been approved by ${author.name}`,
                    send_at: null,
                    deal_id: drawing.deal_id,
                    type: "drawing_approved",
                },
                select: {
                    id: true
                }
            });
            await tx.recipient.createMany({
                data: deal.assigned_to.map((user) => ({
                    user_id: user.user_id,
                    notification_id: notification.id,
                }))
            })
        }
    })
}

export const rejectDrawingService = async (id: string, author: any, note?: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const drawing = await tx.drawing.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: "rejected",
                note: note
            },
            select: {
                uploaded_by: true,
                deal_id: true
            }
        });
        const notification = await tx.notification.create({
            data: {
                title: "Drawing rejected",
                message: `Drawing has been rejected by ${author.name}`,
                type: "drawing_rejected",
                send_at: null,
                deal_id: drawing.deal_id
            },
            select: {
                id: true
            }
        });
        await tx.recipient.create({
            data: {
                notification_id: notification.id,
                user_id: drawing.uploaded_by
            }
        })
    })
}