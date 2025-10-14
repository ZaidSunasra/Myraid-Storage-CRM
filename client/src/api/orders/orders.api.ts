import type { AddOrder, Assignee, Company, order_status, SuccessResponse } from "zs-crm-common";
import axiosInstance from "../axiosInstance";
import type { addPaymentSchema } from "@/features/orders/components/AddPayment";
import type z from "zod/v4";

export type Advance = {
    id: number;
    order_id: number;
    advance_amount: number;
    advance_date: Date;
}
export type Order = {
    id: number;
    deal_id: string;
    created_at: Date;
    status: order_status;
    height: string;
    total_body: number;
    pi_number: string | null;
    po_number: string | null;
    dispatch_at: Date;
    colour: string;
    order_number: number;
    balance: number;
    quotation_id: number;
    advance: Advance[];
    deal : {
        assigned_to : Assignee[]
        company : Pick<Company, "name">
    }
}
export type GetOrderOutput = {
    orders: Order[],
    totalOrders: number
}

type AddPayment = z.infer<typeof addPaymentSchema>;
export type GetOrderSuccessResponse = SuccessResponse & GetOrderOutput

export type GetOrderByIdSuccessResponse = SuccessResponse & {
    order: Order | null
}

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