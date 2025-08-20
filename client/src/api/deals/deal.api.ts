import type { AddDeal, deal_status, GetAllDealSuccessResponse, GetDealByIdSuccessResponse, GetDrawingByIdSuccessResponse, GetDrawingSuccessResponse, GetUploadUrl, GetUploadUrlSuccessResponse, SuccessResponse, UploadDrawing } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const convertLeadToDeal = async ({ id, quotation_code }: { id: string, quotation_code: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/deals/convert/${id}`, { quotation_code });
    return response.data;
}

export const getDeals = async ({ rows, page, employeeIDs, search, startDate, endDate, sources }: { rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string, sources: string[] }): Promise<GetAllDealSuccessResponse> => {
    const response = await axiosInstance.get(`/deals/get?rows=${rows}&page=${page}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${sources}`);
    return response.data;
}

export const editStatus = async ({ id, status }: { id: string, status: deal_status }): Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/deals/edit/status/${id}`, { status });
    return response.data;
}

export const getDealById = async (id: string): Promise<GetDealByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/deals/get/${id}`);
    return response.data;
}

export const addDeal = async (data: AddDeal): Promise<SuccessResponse> => {
    const response = await axiosInstance.post("/deals/add", data);
    return response.data;
}

export const editDeal = async ({data, id} : {data: AddDeal, id: string}) : Promise<SuccessResponse> => {
     const response = await axiosInstance.put(`/deals/edit/${id}`, data);
    return response.data;
}

export const getUploadUrl = async (data: GetUploadUrl): Promise<GetUploadUrlSuccessResponse> => {
    const response = await axiosInstance.post(`/deals/drawing/get-uploadUrl`, data);
    return response.data;
}

export const uploadDrawing = async (data: UploadDrawing): Promise<SuccessResponse> => {
    const response = await axiosInstance.post("deals/drawing/upload", data);
    return response.data;
}

export const getDrawings = async (id: string): Promise<GetDrawingSuccessResponse> => {
    const resposne = await axiosInstance.get(`deals/drawing/get/${id}`);
    return resposne.data;
}

export const getDrawingById = async (id: string): Promise<GetDrawingByIdSuccessResponse> => {
    const response = await axiosInstance.post(`deals/drawing/get/${id}`);
    return response.data;
}

export const deleteDrawing = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`deals/drawing/delete/${id}`);
    return response.data;
}

export const approveDrawing = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`deals/drawing/approve/${id}`);
    return response.data;
}

export const rejectDrawing = async ({ note, id }: { note?: string, id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`deals/drawing/reject/${id}`, { note });
    return response.data;
}