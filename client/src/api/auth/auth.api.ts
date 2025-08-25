import type { AddUser, EditUser, LoginSuccessResponse, LoginUser, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const login = async (data: LoginUser): Promise<LoginSuccessResponse> => {
	const response = await axiosInstance.post("/auth/login", data);
	return response.data;
};

export const logout = async (): Promise<SuccessResponse> => {
	const response = await axiosInstance.post("/auth/logout");
	return response.data;
};

export const signup = async (data: AddUser): Promise<SuccessResponse> => {
	const response = await axiosInstance.post("/auth/signup", data);
	return response.data;
};

export const editUser = async ({data, id} : {data: EditUser, id: number}): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/auth/edit-user/${id}`, data);
	return response.data;
};