import { Notification, Prisma, Product, Source } from "@prisma/client";
import { prisma } from "../../libs/prisma";
import { FetchEmployeeOutput, FetchLeadOutput, FetchLeadSuccessResponse } from "./lead.types";
import { AddLead, AddReminder, EditLead, DEPARTMENTS, reminder_type } from "zs-crm-common"
import { endOfMonth, format, startOfMonth } from "date-fns";

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

export const addLeadService = async ({ first_name, last_name, phones, emails, assigned_to, source_id, product_id, company_name, address, gst_no }: AddLead, author: any): Promise<number> => {
    const editedEmail = convertEmailIntoArray(emails);
    const editedPhone = convertPhoneIntoArray(phones);
    const editedId = covertAssignIdsIntoArray(assigned_to);
    const assignedId = editedId.filter((id) => id !== parseInt(author.id));

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
        const notification = await tx.notification.create({
            data: {
                title: "Lead assigned",
                message: "You were assigned to a lead",
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
        return lead.id;
    })
    return result;
}

export const getLeadsService = async (user: any, page: number, search: string, employeeId: string[], rows: number, startDate: string, endDate: string, sourceId: string[]): Promise<FetchLeadSuccessResponse> => {

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
        const notification = await tx.notification.findMany({
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
                    in: notification.map((n) => n.id)
                }
            }
        })
        await tx.recipient.createMany({
            data: notification.flatMap((n) =>
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
        await tx.recipient.createMany({
            data: assignedNotification.flatMap((n) =>
                assignedId.map((userId) => ({
                    user_id: userId,
                    notification_id: n.id,
                }))
            )
        });
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

export const getLeadByIdService = async (id: string): Promise<FetchLeadOutput | null> => {
    const lead = await prisma.lead.findUnique({
        where: {
            id: parseInt(id)
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

export const getDescriptionsService = async (id: string): Promise<any> => {
    const descriptions = await prisma.description.findMany({
        where: {
            lead_id: parseInt(id)
        },
        select: {
            id: true,
            notes: true,
            updated_at: true,
            updated_by: true,
            lead_id: true,
            created_at: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true
                }
            }
        }
    });
    return descriptions;
}

export const getDescriptionByIdService = async (id: string): Promise<any> => {
    const description = await prisma.description.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    return description;
}

export const addDescriptionService = async (id: string, description: string, author: string): Promise<void> => {
    const ids = [...description.matchAll(/@\[[^\]]+\]\s\((\d+)\)/g)].map(m => Number(m[1]));
    await prisma.$transaction(async (tx) => {
        const description_id = await tx.description.create({
            data: {
                notes: description,
                lead_id: parseInt(id),
                updated_by: parseInt(author)
            },
            select: {
                id: true
            }
        });
        if (ids.length > 0) {
            const notification_id = await tx.notification.create({
                data: {
                    title: "Mentioned you",
                    message: `${author} mentioned you in a lead`,
                    type: "mentioned",
                    send_at: null,
                    description_id: description_id.id
                },
                select: {
                    id: true
                }
            });
            await tx.recipient.createMany({
                data: ids.map((id) => ({
                    notification_id: notification_id.id,
                    user_id: id,
                }))
            });
        }
    })
}

export const editDescriptionService = async (id: string, description: string, author: string): Promise<void> => {
    const ids = [...description.matchAll(/@\[[^\]]+\]\s\((\d+)\)/g)].map(m => Number(m[1]));
    await prisma.$transaction(async (tx) => {
        await tx.description.update({
            where: {
                id: parseInt(id)
            },
            data: {
                notes: description,
                updated_by: parseInt(author)
            }
        })
        const notifications = await tx.notification.findMany({
            where: {
                description_id: parseInt(id)
            },
            select: { id: true }
        })
        for (const notif of notifications) {
            await tx.notification.delete({
                where: {
                    id: notif.id
                }
            });
        }
        if (ids.length > 0) {
            const notification = await tx.notification.create({
                data: {
                    title: "Mentioned you",
                    message: `${author} mentioned you in a lead`,
                    type: "mentioned",
                    send_at: null,
                    description_id: parseInt(id)
                },
                select: {
                    id: true
                }
            });
            await tx.recipient.createMany({
                data: ids.map((id) => ({
                    notification_id: notification.id,
                    user_id: id,
                }))
            });
        }
    })
}

export const deleteDescriptionService = async (id: string): Promise<void> => {
    await prisma.description.delete({
        where: {
            id: parseInt(id)
        }
    });
}

export const addReminderService = async ({ title, send_at, message, lead_id, reminder_type }: AddReminder, id: number): Promise<void> => {
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
            lead_id: lead_id
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
                lead_id: lead_id,
                type: reminder_type
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

export const editReminderService = async ({ title, send_at, message, lead_id, reminder_type }: any, id: string): Promise<any> => {
    await prisma.notification.update({
        where: {
            id: parseInt(id)
        },
        data: {
            title: title,
            message: message,
            send_at: send_at,
            lead_id: lead_id,
            type: reminder_type
        }
    });
}

export const getRemindersService = async (id: string): Promise<Notification[]> => {
    const reminders = await prisma.notification.findMany({
        where: {
            lead_id: parseInt(id),
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

export const fetchSalesEmployeeService = async (): Promise<FetchEmployeeOutput[]> => {
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

export const fetchAllEmployeeService = async (): Promise<FetchEmployeeOutput[]> => {
    const employees = await prisma.user.findMany({
        where: {},
        select: {
            first_name: true,
            last_name: true,
            id: true
        }
    });
    return employees;
}

export const getProductsService = async (): Promise<Product[]> => {
    const products = await prisma.product.findMany();
    return products;
}

export const getSourcesService = async (): Promise<Source[]> => {
    const sources = await prisma.source.findMany();
    return sources;
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

export const getLeadByDurationService = async (duration: "today" | "weekly" | "monthly" | "yearly" | "all"): Promise<any> => {

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

export const getReminderByDateService = async (user: any, month: string): Promise<any> => {

    const now = new Date(month);
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const isAdmin = user.department === DEPARTMENTS[1];

    const reminders = await prisma.notification.findMany({
        where: {
            send_at: {
                gte: start,
                lte: end,
            },
            type: "client_meeting" as reminder_type,
            ...(isAdmin
                ? {}
                : {
                    recipient_list: {
                        some: {
                            user_id: user.id,
                        },
                    },
                }),
        },
        select: {
            id: true,
            title: true,
            send_at: true,
            lead_id: true,
            lead: {
                select: {
                    company: {
                        select: {
                            name: true
                        }
                    },
                    client_detail: {
                        select: {
                            first_name: true,
                            last_name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            send_at: "asc",
        },
    });

    const leads = await prisma.lead.findMany({
        where: {
            created_at: {
                gte: start,
                lte: end
            },
            ...(isAdmin
                ? {}
                : {
                    assigned_to: {
                        some: {
                            user_id: user.id,
                        },
                    },
                }),
        },
        select: {
            id: true,
            created_at: true,
            company: true,
            client_detail: true,
            assigned_to: {
                select: {
                    user: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    },
                }
            }
        },
        orderBy: {
            created_at: 'asc',
        }
    });

    const remindersByDay: Record<string, any[]> = {};
    for (const reminder of reminders) {
        const day = format(reminder.send_at as Date, "yyyy-MM-dd");
        if (!remindersByDay[day]) {
            remindersByDay[day] = [];
        }
        remindersByDay[day].push({
            title: reminder.title,
            lead_id: reminder.lead_id,
            company_name: reminder.lead?.company.name,
            client_name: `${reminder.lead?.client_detail.first_name} ${reminder.lead?.client_detail.last_name}`
        });
    }

    const leadsGrouped = leads.reduce((acc: any, lead) => {
        const date = format(lead.created_at, "yyyy-MM-dd");
        if (!acc[date]) acc[date] = {};
        lead.assigned_to.forEach(({ user }) => {
            const name = `${user.first_name} ${user.last_name}`;
            if (!acc[date][name]) acc[date][name] = [];
            acc[date][name].push(lead);
        });
        return acc;
    }, {});

    return { remindersByDay, leadsGrouped };
}