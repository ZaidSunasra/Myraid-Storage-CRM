import type { GetSourceSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getSources = async (): Promise<GetSourceSuccessResponse> => {
	const response = await axiosInstance.get("/sources/get");
	return response.data;
};

export const addSource = async (name: string): Promise<SuccessResponse> => {
	const response = await axiosInstance.post("/sources/add", {name});
	return response.data;
};

export const editSource = async ({name, id} : {id: string, name: string}): Promise<SuccessResponse> => {
	const response = await axiosInstance.put(`/sources/edit/${id}`, {name});
	return response.data;
};