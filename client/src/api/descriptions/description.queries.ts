import { useQuery } from "@tanstack/react-query";
import { getDescription } from "./description.api";

export const FetchDescription = (id: string, type: "deal" | "lead") => {
	return useQuery({ queryKey: ["description", id], queryFn: () => getDescription(id, type) });
};
