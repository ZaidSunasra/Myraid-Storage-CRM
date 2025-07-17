import type { GetProductSuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getProducts = async (): Promise<GetProductSuccessResponse> => {
    const response = await axiosInstance.get("/products/get");
    return response.data;
}
