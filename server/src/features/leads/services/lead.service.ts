import { prisma } from "../../../libs/prisma";
import { AddLead, EditLead, DEPARTMENTS, GetLeadOutput, GetLeadSuccessResponse, GetLeadByDuration } from "zs-crm-common"

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
                    emails: {
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

export const addLeadService = async ({ first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no }: AddLead, author: any): Promise<void> => {
    const editedEmail = convertEmailIntoArray(emails);
    const editedPhone = convertPhoneIntoArray(phones);
    const editedId = covertAssignIdsIntoArray(assigned_to);
    const assignedId = editedId.filter((id) => id !== parseInt(author.id));

    await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
            data: {
                name: company_name.toLowerCase(),
                address: address.toLowerCase(),
                gst_no: gst_no?.toLowerCase(),
            },
        });
        const client = await tx.client.create({
            data: {
                first_name: first_name.toLowerCase(),
                last_name: last_name.toLowerCase(),
                company_id: company.id
            }
        });
        if (emails && emails.length > 0) {
            await tx.email.createMany({
                data: editedEmail.map((email) => ({
                    client_id: client.id,
                    email: email.toLowerCase(),
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
                company_id: company.id,
                client_id: client.id,
                source_id: source_id,
                product_id: product_id
            }
        });
        await tx.asignee.createMany({
            data: editedId.map((id) => ({
                lead_id: lead.id,
                user_id: id
            }))
        });
        if (assignedId.length > 0) {
            const notification = await tx.notification.create({
                data: {
                    title: "Lead assigned",
                    message: `You were assigned to a lead by ${author.name}`,
                    type: "lead_assigned",
                    send_at: null,
                    lead_id: lead.id
                }
            })
            await tx.recipient.createMany({
                data: assignedId.map((id) => ({
                    notification_id: notification.id,
                    user_id: id
                }))
            })
        }
    })
}

export const getLeadsService = async (user: any, page: number, search: string, employeeId: string[], rows: number, startDate: string, endDate: string, sourceId: string[]): Promise<GetLeadSuccessResponse> => {
    const isAdmin = user.department === DEPARTMENTS[1];
    const leads = await prisma.lead.findMany({
        take: rows,
        skip: (page - 1) * rows,
        where: {
            AND: [
                sourceId.length > 0 ? {
                    source_id: { in: sourceId.map(Number) }
                } : {},
                startDate && endDate ? {
                    created_at: {
                        gte: new Date(startDate),
                        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                } : startDate ? {
                    created_at: {
                        gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                        lte: new Date(new Date(startDate).setHours(23, 59, 59, 999))
                    }
                } : endDate ? {
                    created_at: {
                        gte: new Date(new Date(endDate).setHours(0, 0, 0, 0)),
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
                    : employeeId.length > 0
                        ? { assigned_to: { some: { user_id: { in: employeeId.map(Number) } } } }
                        : {},
            ]
        },
        include: {
            company: true,
            source: true,
            product: true,
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
                    emails: {
                        select: {
                            email: true
                        }
                    },
                    phones: {
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

export const editLeadService = async ({ id, first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no }: EditLead, author: any): Promise<void> => {
    const editedEmail = convertEmailIntoArray(emails);
    const editedPhone = convertPhoneIntoArray(phones);
    const editedId = covertAssignIdsIntoArray(assigned_to);
    const assignedId = editedId.filter((id) => id !== author.id);
    await prisma.$transaction(async (tx) => {
        const updatedLead = await tx.lead.update({
            where: {
                id: id
            },
            data: {
                source_id: source_id,
                product_id: product_id
            },
        });
        await tx.company.update({
            where: {
                id: updatedLead.company_id
            },
            data: {
                address: address.toLowerCase(),
                gst_no: gst_no?.toLowerCase(),
                name: company_name.toLowerCase(),
            }
        });
        await tx.client.update({
            where: {
                id: updatedLead.client_id
            },
            data: {
                first_name: first_name.toLowerCase(),
                last_name: last_name.toLowerCase(),
            }
        });
        await tx.asignee.deleteMany({
            where: {
                lead_id: updatedLead.id
            }
        });
        await tx.asignee.createMany({
            data: editedId.map((id) => ({
                lead_id: updatedLead.id,
                user_id: id
            }))
        })
        await tx.email.deleteMany({
            where: {
                client_id: updatedLead.client_id
            }
        })
        if (editedEmail.length > 0) {
            await tx.email.createMany({
                data: editedEmail.map((email) => ({
                    client_id: updatedLead.client_id,
                    email: email.toLowerCase(),
                }))
            })
        }
        await tx.phone.deleteMany({
            where: {
                client_id: updatedLead.client_id
            }
        })
        await tx.phone.createMany({
            data: editedPhone.map((phone) => ({
                client_id: updatedLead.client_id,
                phone
            }))
        })
        const meetingNotification = await tx.notification.findMany({
            where: {
                lead_id: updatedLead.id,
                type: "client_meeting"
            },
            select: {
                id: true
            }
        })
        await tx.recipient.deleteMany({
            where: {
                notification_id: {
                    in: meetingNotification.map((n) => n.id)
                }
            }
        })
        await tx.recipient.createMany({
            data: meetingNotification.flatMap((n) =>
                editedId.map((userId) => ({
                    user_id: userId,
                    notification_id: n.id,
                }))
            )
        });
        const assignedNotification = await tx.notification.findMany({
            where: {
                lead_id: updatedLead.id,
                type: "lead_assigned"
            },
            select: {
                id: true
            }
        });
        await tx.notification.updateMany({
            where: {
                id: {
                    in: assignedNotification.map((n) => n.id),
                }
            },
            data: {
                is_sent: false
            }
        })
        await tx.recipient.deleteMany({
            where: {
                notification_id: {
                    in: assignedNotification.map((n) => n.id)
                }
            }
        });
        if (assignedId.length > 0) {
            await tx.recipient.createMany({
                data: assignedNotification.flatMap((n) =>
                    assignedId.map((userId) => ({
                        user_id: userId,
                        notification_id: n.id,
                    }))
                )
            });
        }
        else {
            await tx.notification.deleteMany({
                where: {
                    id: {
                        in: assignedNotification.map((n) => n.id)
                    }
                }
            })
        }
    });
}

export const getLeadByIdService = async (lead_id: string): Promise<GetLeadOutput | null> => {
    const lead = await prisma.lead.findUnique({
        where: {
            id: parseInt(lead_id)
        },
        include: {
            company: true,
            source: true,
            product: true,
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
                    emails: {
                        select: {
                            email: true
                        }
                    },
                    phones: {
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

const getDate = (range: "today" | "weekly" | "monthly" | "yearly" | "all") => {
    const now = new Date()
    const dayOfWeek = now.getDay() || 7;
    switch (range) {
        case "today":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
                lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
            }
        case "weekly":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - (dayOfWeek - 1), 0, 0, 0, 0),
                lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
            }
        case "monthly":
            return {
                gte: new Date(now.getFullYear(), now.getMonth(), 0, 0, 0, 0, 0),
                lte: new Date(now)
            }
        case "weekly":
            return {
                gte: new Date(now.getFullYear(), 0, 0, 0, 0, 0, 0),
                lte: new Date(now)
            }
        default:
            return undefined;
    }
}

export const getLeadByDurationService = async (duration: "today" | "weekly" | "monthly" | "yearly" | "all"): Promise<GetLeadByDuration> => {
    const dateFilter = getDate(duration);
    const whereClause = dateFilter ? { created_at: dateFilter } : {};
    const leads = await prisma.lead.findMany({
        where: whereClause,
        select: {
            assigned_to: {
                select: {
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true
                        }
                    }
                }
            }
        }
    });
    const totalLeads = leads.length;
    const employeeLeadCount: Record<string, number> = {};
    for (const lead of leads) {
        for (const asignee of lead.assigned_to) {
            const fullName = `${asignee.user.first_name} ${asignee.user.last_name}`;
            employeeLeadCount[fullName] = (employeeLeadCount[fullName] || 0) + 1
        }
    }
    return { employeeLeadCount, totalLeads }
}