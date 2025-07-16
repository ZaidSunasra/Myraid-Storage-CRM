import type { AddLead, AddReminder } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const getLeads = async ({ page = 1, search, employeeIDs, rows, startDate, endDate, selectedSources }: { page: number, search: string, employeeIDs: string[], rows: number, startDate: string, endDate: string, selectedSources: string[] }): Promise<any> => {
    const response = await axiosInstance.get(`/leads/get?page=${page}&rows=${rows}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${selectedSources}`);
    return response.data;
}

export const getLeadById = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/leads/get/${id}`);
    return response.data;
}

export const addLead = async (data: AddLead): Promise<any> => {
    const response = await axiosInstance.post("/leads/add", data);
    return response.data;
}

export const editLead = async ({ data, id }: { data: AddLead, id: string | undefined }): Promise<any> => {
    const response = await axiosInstance.put(`/leads/edit/${id}`, data);
    return response.data;
}

export const addDescription = async ({ data, id }: { data: any, id: string }): Promise<any> => {
    const response = await axiosInstance.post(`/leads/description/add/${id}`, data);
    return response.data;
}

export const getDescription = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/leads/description/get/${id}`);
    return response.data;
}

export const getDescriptionById = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/leads/description/get/${id}`);
    return response.data;
}

export const editDescription = async ({ data, id }: { data: any, id: string }): Promise<any> => {
    const response = await axiosInstance.put(`/leads/description/edit/${id}`, data);
    return response.data;
}

export const deleteDescription = async (id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/leads/description/delete/${id}`);
    return response.data;
}

export const addReminder = async (data: AddReminder): Promise<any> => {
    const response = await axiosInstance.post("/leads/reminder/add", data);
    return response.data;
}

export const getReminders = async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/leads/reminder/get/${id}`);
    return response.data;
}

export const getReminderByMonth = async (month: string): Promise<any> => {
    const response = await axiosInstance.get(`/leads/reminder/get-by-month/${month}`);
    return response.data;
}

export const editReminder = async ({ data, id }: { data: AddReminder, id: string }): Promise<any> => {
    const response = await axiosInstance.put(`/leads/reminder/edit/${id}`, data);
    return response.data;
}

export const deleteReminder = async (id: string): Promise<any> => {
    const response = await axiosInstance.delete(`/leads/reminder/delete/${id}`);
    return response.data;
}

export const getSalesEmployee = async (): Promise<any> => {
    const response = await axiosInstance.get("/employees/get-sales");
    return response.data;
}

export const getAllEmployee = async (): Promise<any> => {
    const response = await axiosInstance.get("/employees/get-all");
    return response.data;
}

export const getProducts = async (): Promise<any> => {
    const response = await axiosInstance.get("/products/get");
    return response.data;
}

export const getSources = async (): Promise<any> => {
    const response = await axiosInstance.get("/sources/get");
    return response.data;
}

export const getLeadByDuration = async (duration: "today" | "weekly" | "monthly" | "yearly" | "all"): Promise<any> => {
    const response = await axiosInstance.get(`/leads/getBy/${duration}`);
    return response.data;
}

export const getUnreadNotifications = async () : Promise<any> => {
    const response = await axiosInstance.get("/notifications/get-unread");
    return response.data;
}

export const getReadNotifications = async () : Promise<any> => {
    const response = await axiosInstance.get("/notifications/get-read");
    return response.data;
}

export const markNotification = async (id: string) : Promise<any> => {
    const response = await axiosInstance.post(`/notifications/mark-read/${id}`);
    return response.data;
}