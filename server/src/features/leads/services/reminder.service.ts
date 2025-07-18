import { AddReminder, DEPARTMENTS, GetDataByMonth, reminder_type, Reminders } from "zs-crm-common";
import { prisma } from "../../../libs/prisma";
import { endOfMonth, format, startOfMonth } from "date-fns";

export const addReminderService = async ({ title, send_at, message, lead_id, reminder_type }: AddReminder, author_id: number): Promise<void> => {
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
    asignees.forEach(assignee => {
        if (!recipientId.includes(assignee.user_id)) {
            recipientId.push(assignee.user_id);
        }
    })
    if (!recipientId.includes(author_id)) {
        recipientId.push(author_id);
    }
    await prisma.$transaction(async (tx) => {
        const notification = await tx.notification.create({
            data: {
                message: message?.toLowerCase(),
                title: title.toLowerCase(),
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

export const editReminderService = async ({ title, send_at, message, lead_id, reminder_type }: any, reminder_id: string): Promise<void> => {
    await prisma.notification.update({
        where: {
            id: parseInt(reminder_id)
        },
        data: {
            title: title.toLowerCase(),
            message: message.toLowerCase(),
            send_at: send_at,
            lead_id: lead_id,
            type: reminder_type
        }
    });
}

export const getRemindersService = async (lead_id: string): Promise<Reminders[]> => {
    const reminders = await prisma.notification.findMany({
        where: {
            lead_id: parseInt(lead_id),
            type: "client_meeting"
        }
    });
    return reminders;
}

export const deleteReminderService = async (reminder_id: string): Promise<void> => {
    await prisma.notification.delete({
        where: {
            id: parseInt(reminder_id)
        }
    })
}

export const getReminderByDateService = async (user: any, month: string): Promise<GetDataByMonth> => {
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
        include: {
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
        include: {
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