import type { deal_status, GetAllDealSuccessResponse, GetDealByIdSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const convertLeadToDeal = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/deals/convert/${id}`);
    return response.data;
}

export const getDeals = async ({ rows, page, employeeIDs, search, startDate, endDate, sources }: { rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string, sources: string[] }): Promise<GetAllDealSuccessResponse> => {
    const response = await axiosInstance.get(`/deals/get?rows=${rows}&page=${page}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${sources}`);
    return response.data;
}

export const editStatus = async ({ id, status }: { id: number, status: deal_status }): Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/deals/edit/status/${id}`, { status });
    return response.data;
}

export const getDealById = async (id: string): Promise<GetDealByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/deals/get/${id}`);
    return response.data;
}