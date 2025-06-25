import type { LoginUser } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const login = async (data: LoginUser) : Promise<any> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
}