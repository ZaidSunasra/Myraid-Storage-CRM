import type { GetSourceSuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getSources = async (): Promise<GetSourceSuccessResponse> => {
    const response = await axiosInstance.get("/sources/get");
    return response.data;
}
