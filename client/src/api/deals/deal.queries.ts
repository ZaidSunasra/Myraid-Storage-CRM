import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getDealById, getDeals, getOnlyDealId } from "./deal.api"

export const FetchDeals = ({rows, page, employeeIDs, search, startDate, endDate, sources}: {rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string, sources: string[]}) => {
    return useQuery({
        queryKey: ['deals', page, search, employeeIDs, rows, startDate, endDate, sources],
        placeholderData: keepPreviousData,
        queryFn: () => getDeals({rows, page, employeeIDs, search, startDate, endDate, sources})
    })
}

export const FetchDealById = (id: string) => {
    return useQuery({
        queryKey: ['dealById', id],
        queryFn: () => getDealById(id)
    })
}

export const FetchOnlyDealId = () => {
    return useQuery({
        queryKey: ['only-deal-id'],
        queryFn: getOnlyDealId
    })
}