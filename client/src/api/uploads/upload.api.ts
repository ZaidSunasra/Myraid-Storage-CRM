import { type GetDrawingByIdSuccessResponse, type GetDrawingSuccessResponse, type GetUploadUrlSuccessResponse, type SuccessResponse,type GetUploadUrl, type UploadDrawing  } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const getUploadUrl = async (data: GetUploadUrl): Promise<GetUploadUrlSuccessResponse> => {
    const response = await axiosInstance.post(`drawings/get-uploadUrl`, data);
    return response.data;
}

export const uploadDrawing = async (data: UploadDrawing): Promise<SuccessResponse> => {
    const response = await axiosInstance.post("drawings/upload", data);
    return response.data;
}

export const getDrawings = async (id: string, context: "deal" | "order"): Promise<GetDrawingSuccessResponse> => {
    const resposne = await axiosInstance.get(`drawings/get/${id}?context=${context}`);
    return resposne.data;
}

export const getDrawingById = async (id: string): Promise<GetDrawingByIdSuccessResponse> => {
    const response = await axiosInstance.post(`drawings/get/${id}`);
    return response.data;
}

export const deleteDrawing = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.delete(`drawings/delete/${id}`);
    return response.data;
}

export const approveDrawing = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`drawings/approve/${id}`);
    return response.data;
}

export const rejectDrawing = async ({ note, id }: { note?: string, id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`drawings/reject/${id}`, { note });
    return response.data;
}

export const showDrawingInOrder = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.patch(`drawings/show-in-order/${id}`);
    return response.data;
}