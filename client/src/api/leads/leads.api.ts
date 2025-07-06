import type { AddLead, AddReminder } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const getLeads = async({page = 1, search, employeeIDs, rows, startDate, endDate, selectedSources} : {page: number, search: string, employeeIDs: string[], rows:number, startDate: string, endDate: string, selectedSources: string[]}) : Promise<any> => {
    const response = await axiosInstance.get(`/leads/get?page=${page}&rows=${rows}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${selectedSources}`);
    return response.data;
}

export const getEmployeee = async() : Promise<any> => {
    const response = await axiosInstance.get("/leads/fetchEmployee");
    return response.data;
}

export const getLeadById = async(id: string) : Promise<any> => {
    const response = await axiosInstance.get(`/leads/get/${id}`);
    return response.data;
}

export const addDescription = async({data, id} : {data: any, id:string}) : Promise<any> => {
    const response = await axiosInstance.put(`/leads/addDescription/${id}`, data);
    return response.data;
}

export const addReminder = async(data: AddReminder) : Promise<any> => {
    const response = await axiosInstance.post("/leads/addReminder", data);
    return response.data;
}

export const getReminders = async(id: string) : Promise<any> => {
    const response = await axiosInstance.get(`/leads/getReminders/${id}`);
    return response.data;
}

export const addLead = async(data: AddLead) : Promise<any> => {
    const response = await axiosInstance.post("/leads/add", data);
    return response.data;
}

export const editLead = async({data, id} : {data: AddLead, id: string|undefined}) : Promise<any> => {
    const response = await axiosInstance.put(`/leads/edit/${id}`, data);
    return response.data;
}

export const deleteReminder = async(id: string) : Promise<any> => {
    const response = await axiosInstance.delete(`/leads/deleteReminder/${id}`);
    return response.data;
}