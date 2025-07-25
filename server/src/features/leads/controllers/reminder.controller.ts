import { Request, Response } from "express";
import { addReminderSchema, ErrorResponse, GetDataByMonth, GetReminderSuccessResponse, SuccessResponse } from "zs-crm-common";
import { addReminderService, deleteReminderService, editReminderService, getReminderByDateService, getRemindersService } from "../services/reminder.service";

export const fetchRemindersController = async (req: Request, res: Response<GetReminderSuccessResponse | ErrorResponse>): Promise<any> => {
    const lead_id = req.params.id;
    try {
        const reminders = await getRemindersService(lead_id);
        return res.status(200).json({
            message: `Reminder fetched successfully`,
            reminders
        })
    } catch (error) {
        console.log(`Error in fetching reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addReminderController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { title, send_at, message, lead_id, reminder_type } = req.body;
    const author_id = res.locals.user.id
    const validation = addReminderSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addReminderService({ title, send_at, message, lead_id, reminder_type }, author_id)
        return res.status(200).json({
            message: `Reminder added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editReminderController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const reminder_id = req.params.id;
    const { title, send_at, message, lead_id, reminder_type } = req.body;
    const validation = addReminderSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await editReminderService({ title, send_at, message, lead_id, reminder_type }, reminder_id)
        return res.status(200).json({
            message: `Reminder edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const deleteReminderController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const reminder_id = req.params.id;
    try {
        await deleteReminderService(reminder_id);
        return res.status(200).json({
            message: `Reminder deleted successfully`,
        })
    } catch (error) {
        console.log(`Error in deleting reminder`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}


export const fetchRemindersByMonthController = async (req: Request, res: Response< ErrorResponse | GetDataByMonth>): Promise<any> => {
    const user = res.locals.user;
    const month = req.params.month;
    try {
        const { remindersByDay, leadsGrouped } = await getReminderByDateService(user, month);
        return res.status(200).json({
            message: `Reminders by month fetched successfully`,
            remindersByDay,
            leadsGrouped
        })
    } catch (error) {
        console.log(`Error in fetching reminders by month`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}