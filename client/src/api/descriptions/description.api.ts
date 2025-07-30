import type { AddDescription, GetDescriptionByIdSuccessResponse, GetDescriptionSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getDescription = async (id: string, type: "lead" | "deal"): Promise<GetDescriptionSuccessResponse> => {
    const response = await axiosInstance.get(`/descriptions/get/${id}?type=${type}`);
    return response.data;
};

export const getDescriptionById = async (id: string): Promise<GetDescriptionByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/descriptions/get/${id}`);
    return response.data;
};

export const addDescription = async ({ data, id }: { data: AddDescription; id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/descriptions/add/${id}`, data);
    return response.data;
};

export const editDescription = async ({ data, id }: { data: AddDescription; id: string }): Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/descriptions/edit/${id}`, data);
    return response.data;
};

export const deleteDescription = async (id: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.delete(`/descriptions/delete/${id}`);
    return response.data;
};
