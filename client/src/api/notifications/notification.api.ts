import type { GetNotificationSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getUnreadNotifications = async (): Promise<GetNotificationSuccessResponse> => {
	const response = await axiosInstance.get("/notifications/get-unread");
	return response.data;
};

export const getReadNotifications = async (): Promise<GetNotificationSuccessResponse> => {
	const response = await axiosInstance.get("/notifications/get-read");
	return response.data;
};

export const markNotification = async (id: string): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/notifications/mark-read/${id}`);
	return response.data;
};
