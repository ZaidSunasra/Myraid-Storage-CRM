import { Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma";
import { FetchEmployeeOutput, FetchLeadOutput, FetchLeadSuccessResponse } from "./lead.types";
import { AddLead, AddReminder, EditLead } from "zs-crm-common"

export const findExistingEmail = async (email: string, excludedId?: number): Promise<boolean> => {
    if (excludedId !== undefined) {
        const user = await prisma.lead.findFirst({
            where: {
                email,
                NOT: {
                    id: excludedId
                },
            },
        });
        return user?.email ? true : false;
    }
    const user = await prisma.lead.findUnique({
        where: {
            email
        },
    });
    return user?.email ? true : false;
}

export const findExistingCompany = async (company_name: string, gst_no: string, address: string): Promise<Boolean> => {
    const data = await prisma.company.findFirst({
        where: {
            OR: [
                { gst_no: gst_no },
                {
                    AND: [
                        { name: company_name },
                        { address: address }
                    ]
                }
            ]

        },
        select: {
            id: true,
        }
    });
    return data?.id ? true : false;
}

export const findExistingGST = async (id: number, gst_no: string): Promise<boolean> => {
    const comapny = await prisma.company.findFirst({
        where: {
            gst_no,
            lead: {
                some: {
                    NOT: {
                        id
                    }
                }
            }
        }
    });
    return comapny?.gst_no ? true : false;
}

export const addLeadService = async ({ first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no }: AddLead): Promise<number> => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: company_name,
                    address: address,
                    gst_no: gst_no,
                },
            });
            const lead = await tx.lead.create({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    phone: phone,
                    email: email,
                    description: description,
                    company_id: company.id,
                    assigned_to: assigned_to,
                    source: source,
                    product: product
                }
            });
            return lead.id;
        })
        return result;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            const target = (error.meta?.target as string[])?.join(', ') ?? 'field';
            throw new Error(`Unique constraint failed on the ${target}`);
        }
        throw error;
    }
}

export const getLeadsService = async (user: any, page: number, search: any, id: any): Promise<FetchLeadSuccessResponse> => {
    const isAdmin = user.department === "ADMIN";

    const leads = await prisma.lead.findMany({
        take: 10,
        skip: (page - 1) * 10,
        where: {
            AND: [
                search ? {
                    OR: [
                        {
                            company: {
                                name: {
                                    contains: search,
                                    mode: 'insensitive'
                                }
                            }
                        },
                        {
                            first_name: { contains: search, mode: 'insensitive' }
                        },
                        {
                            last_name: { contains: search, mode: 'insensitive' }
                        }
                    ]
                } : {},
                !isAdmin
                    ? { assigned_to: user.id }
                    : id.length > 0
                        ? { assigned_to: { in: id.map(Number) } }
                        : {},
            ]
        },
        include: {
            company: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    const totalLeads = await prisma.lead.count({
        where: user.department === "ADMIN" ? {} : { assigned_to: user.id }
    });
    return { leads, totalLeads };
}

export const editLeadService = async ({ id, first_name, last_name, phone, email, description, assigned_to, source, product, company_name, address, gst_no }: EditLead): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const updatedLead = await prisma.lead.update({
            where: {
                id: id
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                description: description,
                assigned_to: assigned_to,
                source: source,
                product: product
            },
        });
        await prisma.company.update({
            where: {
                id: updatedLead.company_id
            },
            data: {
                address: address,
                gst_no: gst_no,
                name: company_name
            }
        });
    });
}

export const fetchEmployeeService = async (): Promise<FetchEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {
            OR: [
                { department: "ADMIN" },
                { department: "MARKETING" }
            ]
        },
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    });
    return employees;
}

export const getLeadByIdService = async (id: string): Promise<FetchLeadOutput | null> => {
    const lead = await prisma.lead.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            company: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true
                }
            }
        }
    });
    return lead;
}

export const addDescriptionService = async (id: string, description: string): Promise<void> => {
    await prisma.lead.update({
        where: {
            id: parseInt(id)
        },
        data: {
            description: description
        }
    });
}

export const addReminderService = async ({ title, send_at, message, related_id, reminder_type, related_type }: AddReminder, id: number): Promise<void> => {
    const admins = await prisma.user.findMany({
        where: {
            department: "ADMIN"
        },
        select: {
            id: true
        }
    });

    let recipientId = [...admins.map((admin) => admin.id)];
    if (!recipientId.includes(id)) {
        recipientId.push(id);
    }

    await prisma.$transaction(async (tx) => {
        const notification = await tx.notification.create({
            data: {
                message: message,
                title: title,
                send_at: new Date(send_at),
                related_id: parseInt(related_id),
                type: reminder_type,
                related_type: related_type
            },
            select: {
                id: true
            }
        });
        await tx.recipient.createMany({
            data: recipientId.map(id => ({
                notification_id: notification.id,
                user_id: id
            }))
        });
    });
}

export const getReminders = async(id: string) : Promise<any> => {
    const reminders = await prisma.notification.findMany({
        where: {
            related_id: parseInt(id),
            related_type: "LEAD"
        }
    });
    return reminders;
}