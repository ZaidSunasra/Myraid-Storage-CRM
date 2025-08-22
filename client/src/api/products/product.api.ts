import type { GetProductSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getProducts = async (): Promise<GetProductSuccessResponse> => {
	const response = await axiosInstance.get("/products/get");
	return response.data;
};

export const addProduct = async (name: string): Promise<SuccessResponse> => {
	const response = await axiosInstance.post("/products/add", {name});
	return response.data;
};

export const editProduct = async ({name, id} : {id: string, name: string}): Promise<SuccessResponse> => {
	const response = await axiosInstance.put(`/products/edit/${id}`, {name});
	return response.data;
};