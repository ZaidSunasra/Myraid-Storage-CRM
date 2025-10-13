import type { SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";
import type { AddOrder } from "@/features/orders/pages/AddOrderPage";

export const addOrder = async ({ data }: { data: AddOrder }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/orders/add`, data);
    return response.data;
};
