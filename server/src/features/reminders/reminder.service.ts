import { AddReminder, DEPARTMENTS, GetDataByMonth, LeadByDay, reminder_type, ReminderMonth, Reminders } from "zs-crm-common";
import { prisma } from "../../libs/prisma";
import { endOfMonth, format, startOfMonth } from "date-fns";

export const addReminderService = async ({ title, send_at, message, reminder_type, type }: AddReminder, author_id: number, id: string): Promise<void> => {
    const asignees = await prisma.asignee.findMany({
        where: {
            lead_id: type === "lead" ? parseInt(id) : null,
            deal_id: type === "deal" ? id : null
        },
        select: {
            user_id: true
        }
    });
    const recipientIds = new Set<number>();
    asignees.forEach(a => recipientIds.add(a.user_id));
    recipientIds.add(author_id);
    await prisma.$transaction(async (tx) => {
        const notification = await tx.notification.create({
            data: {
                message: message?.toLowerCase() ? `${message.toLowerCase()}` : "Client Meeting",
                title: title.toLowerCase(),
                send_at: new Date(send_at),
                lead_id: type === "lead" ? parseInt(id) : null,
                deal_id: type === "deal" ? id : null,
                type: reminder_type
            },
            select: {
                id: true
            }
        });
        await tx.recipient.createMany({
            data: Array.from(recipientIds).map(id => ({
                notification_id: notification.id,
                user_id: id
            }))
        });
    });
}

export const editReminderService = async ({ title, send_at, message, reminder_type }: AddReminder, reminder_id: string): Promise<void> => {
    await prisma.notification.update({
        where: {
            id: parseInt(reminder_id)
        },
        data: {
            title: title.toLowerCase(),
            message: String(message).toLowerCase(),
            send_at: send_at,
            type: reminder_type
        }
    });
}

export const getRemindersService = async (id: string, type: "deal" | "lead"): Promise<Reminders[]> => {
    const reminders = await prisma.notification.findMany({
        where: {
            lead_id: type === "lead" ? parseInt(id) : null,
            deal_id: type === "deal" ? id : null,
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

    const sharedWhere = {
        created_at: {
            gte: start,
            lte: end,
        },
        ...(isAdmin
            ? {}
            : {
                assigned_to: {
                    some: { user_id: user.id },
                },
            }),
    };

    const sharedSelect = {
        id: true,
        created_at: true,
        company: { select: { name: true } },
        client_detail: { select: { first_name: true, last_name: true } },
        assigned_to: {
            select: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        },
    };

    const reminders = await prisma.notification.findMany({
        where: {
            send_at: { gte: start, lte: end },
            type: "client_meeting" as reminder_type,
            ...(isAdmin
                ? {}
                : {
                    recipient_list: { some: { user_id: user.id } },
                }),
        },
        select: {
            lead_id: true,
            deal_id: true,
            title: true,
            send_at: true,
            lead: {
                select: {
                    company: { select: { name: true } },
                    client_detail: { select: { first_name: true, last_name: true } },
                },
            },
            deal: {
                select: {
                    company: { select: { name: true } },
                    client_detail: { select: { first_name: true, last_name: true } },
                },
            },
        },
        orderBy: { send_at: "asc" },
    });

    const [leads, deals] = await Promise.all([
        prisma.lead.findMany({ where: sharedWhere, select: { ...sharedSelect, deal: { select: { id: true } } }, orderBy: { created_at: "asc" } }),
        prisma.deal.findMany({ where: sharedWhere, select: sharedSelect, orderBy: { created_at: "asc" } }),
    ]);

    const remindersByDay: Record<string, ReminderMonth[]> = {};
    for (const reminder of reminders) {
        const day = format(reminder.send_at as Date, "yyyy-MM-dd");
        if (!remindersByDay[day]) remindersByDay[day] = [];

        remindersByDay[day].push({
            title: reminder.title,
            lead_id: reminder.lead_id,
            deal_id: reminder.deal_id,
            company_name: reminder.lead?.company.name !== undefined ? `${reminder.lead?.company.name}` : `${reminder.deal?.company.name}`,
            client_name:
                reminder.lead?.client_detail.first_name !== undefined
                    ? `${reminder.lead.client_detail.first_name} ${reminder.lead.client_detail.last_name}`
                    : `${reminder.deal?.client_detail.first_name} ${reminder.deal?.client_detail.last_name}`,
        });
    }

    const groupLeads = (records: typeof leads, grouped: GetDataByMonth["grouped"]) => {
        for (const record of records) {
            const date = format(record.created_at, "yyyy-MM-dd");
            record.assigned_to.forEach(({ user }) => {
                const emp = `${user.first_name} ${user.last_name}`;
                if (!grouped[date]) grouped[date] = {};
                if (!grouped[date][emp]) grouped[date][emp] = { leads: [], deals: [] };

                grouped[date][emp].leads.push({
                    lead_id: record.id,
                    deal_id: record.deal.length > 0 ? record.deal[0].id : "",
                    company_name: record.company.name,
                    client_name: `${record.client_detail.first_name} ${record.client_detail.last_name}`
                });
            });
        }
    };

    const groupDeals = (records: typeof deals, grouped: GetDataByMonth["grouped"]) => {
        for (const record of records) {
            const date = format(record.created_at, "yyyy-MM-dd");
            record.assigned_to.forEach(({ user }) => {
                const emp = `${user.first_name} ${user.last_name}`;
                if (!grouped[date]) grouped[date] = {};
                if (!grouped[date][emp]) grouped[date][emp] = { leads: [], deals: [] };

                grouped[date][emp].deals.push({
                    deal_id: record.id,
                   company_name: record.company.name,
                   client_name: `${record.client_detail.first_name} ${record.client_detail.last_name}`
                });
            });
        }
    };

    const grouped: GetDataByMonth["grouped"] = {};
    groupLeads(leads, grouped);
    groupDeals(deals, grouped);

    return { remindersByDay, grouped };
};
