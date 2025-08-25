import type { GetAllEmployeeSuccessResponse, GetEmployeeSuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getSalesEmployee = async (): Promise<GetEmployeeSuccessResponse> => {
	const response = await axiosInstance.get("/employees/get-sales");
	return response.data;
};

export const getAllEmployee = async (): Promise<GetAllEmployeeSuccessResponse> => {
	const response = await axiosInstance.get("/employees/get-all");
	return response.data;
};

export const getAssignedEmployee = async(id: string, type: "deal" | "lead") : Promise<GetEmployeeSuccessResponse> => {
	const response = await axiosInstance.get(`/employees/get-assigned/${id}?type=${type}`);
	return response.data;
}