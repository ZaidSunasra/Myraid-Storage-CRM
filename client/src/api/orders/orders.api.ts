import type { AddOrder, AddPayment, GetOrderByIdSuccessResponse, GetOrderSuccessResponse, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const addOrder = async ({ data }: { data: AddOrder }): Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/orders/add`, data);
    return response.data;
};

export const getOrders = async ({ rows, page, employeeIDs, search, startDate, endDate }: { rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string}): Promise<GetOrderSuccessResponse> => {
    const response = await axiosInstance.get(`/orders/get?rows=${rows}&page=${page}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
}

export const getOrderById = async (id: string) : Promise<GetOrderByIdSuccessResponse> => {
    const response = await axiosInstance.get(`/orders/get/${id}`);
    return response.data;
}

export const editOrder = async ({ data, id }: { data: AddOrder, id : string}): Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/orders/edit/${id}`, data);
    return response.data;
};

export const addPayment = async ({data, order_id} : {data: AddPayment, order_id : string}) : Promise<SuccessResponse> => {
    const response = await axiosInstance.post(`/orders/add/payment/${order_id}`, data);
    return response.data;
}

export const editPayment = async ({data, id} : {data: AddPayment, id : string}) : Promise<SuccessResponse> => {
    const response = await axiosInstance.put(`/orders/edit/payment/${id}`, data);
    return response.data;
}

export const deletePayment = async (id: number) : Promise<SuccessResponse> => {
    const response = await axiosInstance.delete(`/orders/delete/payment/${id}`);
    return response.data;
}