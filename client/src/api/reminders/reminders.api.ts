import type { AddReminder, GetDataByMonth, GetReminderSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getReminders = async (id: string, type: "deal" | "lead"): Promise<GetReminderSuccessResponse> => {
	const response = await axiosInstance.get(`/reminders/get/${id}?type=${type}`);
	return response.data;
};

export const getReminderByMonth = async (month: string): Promise<GetDataByMonth> => {
	const response = await axiosInstance.get(`/reminders/get-by-month/${month}`);
	return response.data;
};

export const addReminder = async ({data, id} : {data: AddReminder, id: string}): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/reminders/add/${id}`, data);
	return response.data;
};

export const editReminder = async ({ data, id }: { data: AddReminder; id: string }): Promise<SuccessResponse> => {
	const response = await axiosInstance.put(`/reminders/edit/${id}`, data);
	return response.data;
};

export const deleteReminder = async (id: string): Promise<SuccessResponse> => {
	const response = await axiosInstance.delete(`/reminders/delete/${id}`);
	return response.data;
};
