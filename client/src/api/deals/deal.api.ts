import axiosInstance from "../axiosInstance"

export const convertLeadToDeal = async (id: string) : Promise<any> => {
    const response = await axiosInstance.post(`/deals/convert/${id}`);
    return response.data;
}