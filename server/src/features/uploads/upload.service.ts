import { DEPARTMENTS, GetAllDrawingOutput, GetDrawingOutput, UploadDrawing } from "zs-crm-common";
import { prisma } from "../../libs/prisma.js";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../../libs/awsS3Client.js";

export const getUploadUrlService = async (fileKey: string, fileType: string): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 30 });
    return uploadUrl;
}

export const uploadDrawingService = async ({ drawing_url, title, version, deal_id, file_size, file_type, order_id, upload_type, context }: UploadDrawing, author: any): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const admins = await tx.user.findMany({
            where: {
                department: DEPARTMENTS[1],
            }
        });
        await tx.drawing.create({
            data: {
                file_url: drawing_url,
                title: title,
                version: version,
                deal_id: context === "deal" ? deal_id : null,
                order_id: context === "order" ? parseInt(order_id) : null,
                file_size: file_size,
                file_type: file_type,
                uploaded_by: author.id,
                upload_type: upload_type,
                status: upload_type === "general" ? "approved" : author.department === DEPARTMENTS[1] ? "approved" : "pending",
            }
        });
        if ((upload_type === "general") || (author.department === DEPARTMENTS[1])) {
            const deal = await tx.deal.findUnique({
                where: {
                    id: deal_id
                },
                select: {
                    assigned_to: {
                        select: {
                            user: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                }
            })
            if (deal && deal?.assigned_to.length > 0) {
                const notification = await tx.notification.create({
                    data: {
                        title: "Drawing approved",
                        message: `Drawing for ${deal_id ? `DEAL No: ${deal_id} Version: ${version}` : `Order No: ${order_id}`}  has been approved by ${author.name}`,
                        send_at: null,
                        deal_id: deal_id,
                        order_id: parseInt(order_id),
                        type: "drawing_approved",
                    },
                    select: {
                        id: true
                    }
                });
                await tx.recipient.createMany({
                    data: deal?.assigned_to.map((user) => ({
                        user_id: user.user.id,
                        notification_id: notification.id,
                    }))
                })
            }
        } else {
            const notification = await tx.notification.create({
                data: {
                    message: `Drawing No: ${title} Version: ${version} for ${context == "deal" ? `DEAL No: ${deal_id}` : `Order No: ${order_id}`} has been uploaded by ${author.name}. Kindly review and approve when you have a moment.`,
                    title: "Drawing uploaded",
                    type: "drawing_uploaded",
                    deal_id: deal_id ?? null,
                    order_id: context === "order" ? parseInt(order_id) : null,
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
        }
    })
}

export const getDrawingsService = async (id: string, author: any, context: "deal" | "order"): Promise<GetDrawingOutput> => {
    const viewPermissions = await prisma.permission.findMany({
        where: {
            permission_key: {
                in: ["view_pi", "view_po", "view_drawing", "view_general"],
            },
        },
    });
    const VIEW_RULES = viewPermissions.reduce<Record<string, string[]>>((acc, p) => {
        const type = p.permission_key.replace("view_", "");
        acc[type] = p.allowed_dept;
        return acc;
    }, {});

    const STATUS_RULES: Record<string, string[]> = {
        sales: ["approved"],
        admin: ["approved", "pending", "rejected"],
        factory: ["approved", "rejected"],
        accounts: ["approved", "rejected"],
        drawing: ["approved", "pending", "rejected"],
    };

    const uploads = await prisma.drawing.findMany({
        where: {
            ...(context === "deal" ? { deal_id: id } : {}),
            ...(context === "order" ? { order_id: parseInt(id) } : {}),
        },
        include: {
            user: { select: { first_name: true, last_name: true, id: true } },
        },
    });

    const visibleUploads = uploads.filter(u => {
        const allowedDepts = VIEW_RULES[u.upload_type] || [];
        const allowedStatuses = STATUS_RULES[author.department] || [];
        return allowedDepts.includes(author.department) && allowedStatuses.includes(u.status);
    });

    const grouped = {
        rejected: visibleUploads.filter(u => u.status === "rejected"),
        pending: visibleUploads.filter(u => u.status === "pending"),
        approved: visibleUploads.filter(u => u.status === "approved"),
    };

    return { drawings: grouped, totalDrawing: visibleUploads.length };
};


export const getDrawingByIdService = async (id: string): Promise<string | null> => {
    const drawing = await prisma.drawing.findUnique({
        where: {
            id: parseInt(id)
        },
        select: {
            file_url: true
        }
    });
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: drawing?.file_url,
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
                file_url: true
            }
        });
        if (drawing?.file_url) {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: drawing.file_url,
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
                deal_id: true,
                order_id: true,
                version: true
            }
        });
        const deal = await tx.deal.findUnique({
            where: { id: drawing.deal_id ?? "" },
            select: {
                assigned_to: { select: { user_id: true } }
            }
        });
        if (deal?.assigned_to?.length) {
            const notification = await tx.notification.create({
                data: {
                    title: "Drawing approved",
                    message: `Drawing for ${drawing.deal_id ? `DEAL No: ${drawing.deal_id} Version: ${drawing.version}` : `Order No: ${drawing.order_id}`}  has been approved by ${author.name}`,
                    send_at: null,
                    deal_id: drawing.deal_id,
                    order_id: drawing.order_id,
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
                deal_id: true,
                order_id: true,
                version: true
            }
        });
        const notification = await tx.notification.create({
            data: {
                title: "Drawing rejected",
                message: `Drawing for ${drawing.deal_id ? `DEAL No: ${drawing.deal_id} Version: ${drawing.version}` : `Order No: ${drawing.order_id}`} has been rejected by ${author.name}`,
                type: "drawing_rejected",
                send_at: null,
                deal_id: drawing.deal_id,
                order_id: drawing.order_id
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

export const showDrawingInOrderService = async (id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const deal = await tx.drawing.findUnique({
            where: {
                id: parseInt(id)
            },
            select: {
                deal: {
                    select: {
                        order: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                show_in_order: true
            }
        });
        if (deal?.show_in_order) {
            await tx.drawing.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    order_id: null,
                    show_in_order: false
                }
            });
        } else {
            await tx.drawing.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    order_id: deal?.deal?.order?.id,
                    show_in_order: true
                }
            });
        }
    })
}

export const getAllDrawingsService = async (rows: number, page: number, search: string): Promise<GetAllDrawingOutput> => {
    const drawings = await prisma.drawing.findMany({
        where: {
            AND: [
                search ? {
                    OR: [
                        {
                            deal_id: { contains: search, mode: 'insensitive' }
                        },
                        {
                            title: { contains: search, mode: 'insensitive' }
                        },
                        !isNaN(Number(search))
                            ? { order_id: { equals: Number(search) } }
                            : {}
                    ]
                } : {},
                { status: "approved" },
            ]
        },
        take: rows,
        skip: (page - 1) * rows,
        select: {
            id: true,
            uploaded_at: true,
            upload_type: true,
            file_size: true,
            title: true,
            deal_id: true,
            order_id: true,
            version: true
        },
        orderBy: {
            uploaded_at: "desc"
        }
    });
    const totalDrawing = await prisma.drawing.count()
    return { drawings, totalDrawing };
}