import type { AddOrder, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const addOrder = async ({ data }: { data: AddOrder }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/orders/add`, data);
    return response.data;
};
