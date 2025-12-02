import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllDrawings, getDrawings } from "./upload.api"

export const FetchDrawings = (id: string, context: "order" | "deal") => {
    return useQuery({
        queryKey: ['drawings', id],
        queryFn: () => getDrawings(id, context)
    })
}

export const FetchAllDrawings = ({ rows, page, search, }: { rows: number, page: number, search: string }) => {
    return useQuery({
        queryKey: ['all-drawings', rows, page, search],
        placeholderData: keepPreviousData,
        queryFn: () => getAllDrawings({ rows, page, search })
    })
}
