import type { AddUser, department, EditUser, LoginSuccessResponse, LoginUser, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";
import z from "zod/v4";

export const changePasswordSchema = z.object({
	new_password: z.string().min(6, "Password should be 6 characters long at least"),
	old_password: z.string().min(6, "Password should be 6 characters long at least"),
})
export type ChangePassword = z.infer<typeof changePasswordSchema>;

export type GetUserDetailOutput = {
	first_name: string,
	last_name: string,
	email: string,
	phone: string,
	department: department,
	quotation_code: string | null,
	id: number
}

export type GetUserDetailSuccessResponse = SuccessResponse & { detail: GetUserDetailOutput | null }

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

export const editUser = async ({ data, id }: { data: EditUser, id: number }): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/auth/edit-user/${id}`, data);
	return response.data;
};

export const changePassword = async (data: ChangePassword): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/auth/change-password`, data);
	return response.data;
};

export const resetPassword = async (id: number): Promise<SuccessResponse> => {
	const response = await axiosInstance.post(`/auth/reset-password/${id}`);
	return response.data;
};

export const getUserDetail = async (): Promise<GetUserDetailSuccessResponse> => {
	const response = await axiosInstance.get(`/auth/user-info`);
	return response.data;
};