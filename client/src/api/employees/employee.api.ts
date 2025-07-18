import type { GetEmployeeSuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getSalesEmployee = async (): Promise<GetEmployeeSuccessResponse> => {
	const response = await axiosInstance.get("/employees/get-sales");
	return response.data;
};

export const getAllEmployee = async (): Promise<GetEmployeeSuccessResponse> => {
	const response = await axiosInstance.get("/employees/get-all");
	return response.data;
};
