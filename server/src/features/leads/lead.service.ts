import { Notification, Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma";
import { FetchEmployeeOutput, FetchLeadOutput, FetchLeadSuccessResponse } from "./lead.types";
import { AddLead, AddReminder, EditLead, DEPARTMENTS } from "zs-crm-common"

export const convertEmailIntoArray = (emails?: { email?: string }[]): string[] => {
    const emailStrings = emails?.map((e: any) => e.email?.trim()).filter((e: any): e is string => !!e) ?? [];
    return emailStrings;
}

export const convertPhoneIntoArray = (phones: { number: string }[]): string[] => {
    const phoneStrings = phones
        ?.map((e: any) => e.number?.trim())
        .filter((e: any): e is string => !!e) ?? [];
    return phoneStrings;
}

export const covertAssignIdsIntoArray = (assigned_to: { id: number }[]): number[] => {
    const idStrings = assigned_to?.map((e: any) => e.id).filter((e: any): e is number => !!e) ?? [];
    return idStrings;
}

export const findExistingEmail = async (emails: string[], excludedId?: number): Promise<boolean> => {
    if (excludedId !== undefined) {
        const user = await prisma.lead.findFirst({
            where: {
                NOT: {
                    id: excludedId
                },
                client_detail: {
                    email: {
                        some: {
                            email: {
                                in: emails
                            }
                        }
                    }
                }
            },
        });
        return !!user;
    }
    const user = await prisma.email.findFirst({
        where: {
            email: {
                in: emails,
                not: {
                    equals: ""
                }
            }
        },
    });
    return !!user;
}

export const findExistingCompany = async (company_name: string, gst_no: string, address: string): Promise<Boolean> => {
    const data = await prisma.company.findFirst({
        where: {
            OR: [
                ...(gst_no ? [{ gst_no }] : []),
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

export const addLeadService = async ({ first_name, last_name, phones, emails, description, assigned_to, source, product, company_name, address, gst_no }: AddLead): Promise<number> => {
    try {
        const editedEmail = convertEmailIntoArray(emails);
        const editedPhone = convertPhoneIntoArray(phones);
        const editedId = covertAssignIdsIntoArray(assigned_to);
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: company_name,
                    address: address,
                    gst_no: gst_no,
                },
            });
            const client = await tx.client.create({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    company_id: company.id
                }
            });
            if (emails && emails.length > 0) {
                await tx.email.createMany({
                    data: editedEmail.map((email) => ({
                        client_id: client.id,
                        email: email
                    }))
                })
            }
            if (phones.length > 0) {
                await tx.phone.createMany({
                    data: editedPhone.map((phone) => ({
                        client_id: client.id,
                        phone: phone
                    }))
                })
            }
            const lead = await tx.lead.create({
                data: {
                    description: description,
                    company_id: company.id,
                    client_id: client.id,
                    source: source,
                    product: product
                }
            });
            await tx.asignee.createMany({
                data: editedId.map((id) => ({
                    lead_id: lead.id,
                    user_id: id
                }))
            })
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

export const getLeadsService = async (user: any, page: number, search: string, id: any, rows: number, startDate: string, endDate: string): Promise<FetchLeadSuccessResponse> => {

    const isAdmin = user.department === DEPARTMENTS[1];
    const leads = await prisma.lead.findMany({
        take: rows,
        skip: (page - 1) * rows,
        where: {
            AND: [
                startDate && endDate ? {
                    created_at: {
                        gte: new Date(startDate),
                        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                } : startDate ? {
                    created_at: {
                        gte: new Date(startDate),
                        lte: new Date()
                    }
                } : endDate ? {
                    created_at: {
                        gte: new Date("2020 01 01"),
                        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                } : {},
                search ? {
                    OR: [
                        {
                            company: {
                                name: { contains: search, mode: 'insensitive' }
                            }
                        },
                        {
                            client_detail: {
                                first_name: { contains: search, mode: 'insensitive' }
                            }
                        },
                        {
                            client_detail: {
                                last_name: { contains: search, mode: 'insensitive' }
                            }
                        }
                    ]
                } : {},
                !isAdmin
                    ? { assigned_to: { some: { user_id: user.id } } }
                    : id.length > 0
                        ? { assigned_to: { some: { user_id: { in: id.map(Number) } } } }
                        : {},
            ]
        },
        include: {
            company: true,
            assigned_to: {
                select: {
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            id: true
                        }
                    }
                }
            },
            client_detail:
            {
                select: {
                    first_name: true,
                    last_name: true,
                    email: {
                        select: {
                            email: true
                        }
                    },
                    phone: {
                        select: {
                            phone: true
                        }
                    }
                },
            },
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    const totalLeads = await prisma.lead.count({
        where: user.department === DEPARTMENTS[1] ? {} : { assigned_to: { some: { user_id: user.id } } }
    });
    return { leads, totalLeads };
}

export const editLeadService = async ({ id, first_name, last_name, phones, emails, description, assigned_to, source, product, company_name, address, gst_no }: EditLead): Promise<void> => {
    const editedEmail = convertEmailIntoArray(emails);
    const editedPhone = convertPhoneIntoArray(phones);
    const editedId = covertAssignIdsIntoArray(assigned_to);
    await prisma.$transaction(async (tx) => {
        const updatedLead = await tx.lead.update({
            where: {
                id: id
            },
            data: {
                description: description,
                source: source,
                product: product
            },
        });
        await tx.company.update({
            where: {
                id: updatedLead.company_id
            },
            data: {
                address: address,
                gst_no: gst_no,
                name: company_name
            }
        });
        await tx.client.update({
            where: {
                id: updatedLead.client_id
            },
            data: {
                first_name: first_name,
                last_name: last_name
            }
        });
        await tx.asignee.deleteMany({
            where: {
                lead_id: updatedLead.id
            }
        })
        await tx.email.deleteMany({
            where: {
                client_id: updatedLead.client_id
            }
        })
        await tx.phone.deleteMany({
            where: {
                client_id: updatedLead.client_id
            }
        })
        if (emails && emails.length > 0) {
            await tx.email.createMany({
                data: editedEmail?.filter((e) => e.trim() !== "").map((email) => ({
                    client_id: updatedLead.client_id,
                    email
                }))
            })
        }
        await tx.phone.createMany({
            data: editedPhone.map((phone) => ({
                client_id: updatedLead.client_id,
                phone
            }))
        })
        await tx.asignee.createMany({
            data: editedId.map((id) => ({
                lead_id: updatedLead.id,
                user_id: id
            }))
        })
    });
}

export const fetchEmployeeService = async (): Promise<FetchEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {
            OR: [
                { department: DEPARTMENTS[1] },
                { department: DEPARTMENTS[0] }
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
            assigned_to: {
                select: {
                    user: {
                        select: {
                            first_name: true,
                            last_name: true,
                            id: true
                        }
                    }
                }
            },
            client_detail:
            {
                select: {
                    first_name: true,
                    last_name: true,
                    email: {
                        select: {
                            email: true
                        }
                    },
                    phone: {
                        select: {
                            phone: true
                        }
                    }
                },
            },
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
            department: DEPARTMENTS[1]
        },
        select: {
            id: true
        }
    });

    const asignees = await prisma.asignee.findMany({
        where: {
            lead_id: parseInt(related_id)
        },
        select: {
            user_id: true
        }
    });

    let recipientId = [...admins.map((admin) => admin.id)];

    asignees.forEach(a => {
        if (!recipientId.includes(a.user_id)) {
            recipientId.push(a.user_id);
        }
    })

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

export const getRemindersService = async (id: string): Promise<Notification[]> => {
    const reminders = await prisma.notification.findMany({
        where: {
            related_id: parseInt(id),
            related_type: "lead"
        }
    });
    return reminders;
}

export const deleteReminderService = async (id: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        await tx.recipient.deleteMany({
            where: {
                notification_id: parseInt(id)
            }
        })
        await tx.notification.delete({
            where: {
                id: parseInt(id)
            }
        })
    })

}