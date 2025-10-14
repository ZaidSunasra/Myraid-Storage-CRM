import { useQuery } from "@tanstack/react-query"
import { getDrawings } from "./upload.api"

export const FetchDrawings = (id: string, context: "order" | "deal") => {
    return useQuery({
        queryKey: ['drawings', id],
        queryFn: () => getDrawings(id, context)
    })
}
