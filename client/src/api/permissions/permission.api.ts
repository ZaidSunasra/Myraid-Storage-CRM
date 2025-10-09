import axiosInstance from "../axiosInstance";
import type { GetPermissionSuccessResponse, SuccessResponse, EditPermission } from "zs-crm-common";

export const getPermissions = async (): Promise<GetPermissionSuccessResponse> => {
    const response = await axiosInstance.get("/permissions/get-all");
    return response.data;
};

export const editPermission = async ({data, id} : {data: EditPermission, id: string}) : Promise<SuccessResponse> => {
const resposne = await axiosInstance.put(`/permissions/edit/${id}`, data);
return resposne.data;
}