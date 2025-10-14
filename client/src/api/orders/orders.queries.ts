import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getOrderById, getOrders } from "./orders.api"

export const FetchOrders = ({ rows, page, employeeIDs, search, startDate, endDate }: { rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string }) => {
    return useQuery({
        queryKey: ['orders', page, search, employeeIDs, rows, startDate, endDate],
        placeholderData: keepPreviousData,
        queryFn: () => getOrders({ rows, page, employeeIDs, search, startDate, endDate })
    })
}

export const FetchOrderById = (id: string) => {
    return useQuery({
        queryKey: ['orderById', id],
        queryFn: () => getOrderById(id)
    })
}