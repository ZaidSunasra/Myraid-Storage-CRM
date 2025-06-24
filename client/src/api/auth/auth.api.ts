import axiosInstance from "../axiosInstance"

export const login = async (data: any) : Promise<any> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
}