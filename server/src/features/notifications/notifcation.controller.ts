import { Response, Request } from "express";
import { getReadNotificationsService, getUnreadNotificationsService, markNotificationService } from "./notification.service";
import { ErrorResponse, GetReadNotificationSuccessResponse, GetUnreadNotificationSuccessResponse, SuccessResponse } from "zs-crm-common";

export const getUnreadNotificationsController = async (req: Request, res: Response<ErrorResponse | GetUnreadNotificationSuccessResponse>): Promise<any> => {
    const user_id = res.locals.user.id;
    try {
        const notifications = await getUnreadNotificationsService(user_id);
        return res.status(200).json({
            message: `Notifications fetched successfully`,
            notifications,
        })
    } catch (error) {
        console.log(`Error in fetching unread notifications`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const getReadNotificationsController = async (req: Request, res: Response<ErrorResponse | GetReadNotificationSuccessResponse>): Promise<any> => {
    const user_id = res.locals.user.id;
    try {
        const notifications = await getReadNotificationsService(user_id);
        return res.status(200).json({
            message: `Notifications fetched successfully`,
            notifications,
        })
    } catch (error) {
        console.log(`Error in fetching read notifications`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const markNotificationController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const recipient_id = req.params.id as string;
    try {
        await markNotificationService(recipient_id)
        return res.status(200).json({
            message: `Notification mark as read successfully`,
        })
    } catch (error) {
        console.log(`Error in marking notification as read`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}
