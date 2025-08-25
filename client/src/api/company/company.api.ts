import type { EditClient, EditCompany, GetCompanySuccessResponse, GetEmployeeByCompanySuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance"

export const getCompanies = async (name: string) : Promise<GetCompanySuccessResponse> => {
    const response = await axiosInstance.get(`/company/get?name=${name}`);
    return response.data;
}

export const  getCompanyEmployee = async (id: number) : Promise<GetEmployeeByCompanySuccessResponse> => {
    const response = await axiosInstance.get(`/company/get-client/${id}`);
    return response.data;
}

export const  addCompanyEmployee = async ({data, id} : {data: EditClient, id: number}) : Promise<GetEmployeeByCompanySuccessResponse> => {
    const response = await axiosInstance.post(`/company/add/client/${id}`, data);
    return response.data;
}

export const  editCompanyEmployee = async ({data, id} : {data: EditClient, id: number}) : Promise<GetEmployeeByCompanySuccessResponse> => {
    const response = await axiosInstance.put(`/company/edit/client/${id}`, data);
    return response.data;
}

export const  editCompanyDetail = async ({data, id} : {data: EditCompany, id: number}) : Promise<GetEmployeeByCompanySuccessResponse> => {
    const response = await axiosInstance.put(`/company/edit/company-details/${id}`, data);
    return response.data;
}