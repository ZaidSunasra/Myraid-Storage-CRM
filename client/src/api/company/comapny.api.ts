import type { GetCompanySuccessResponse, GetEmployeeByCompanySuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const getCompanies = async (name: string) : Promise<GetCompanySuccessResponse> => {
    const response = await axiosInstance.get(`/company/get?name=${name}`);
    return response.data;
}

export const  getCompanyEmployee = async (id: number) : Promise<GetEmployeeByCompanySuccessResponse> => {
    const response = await axiosInstance.get(`/company/get-employee/${id}`);
    return response.data;
}