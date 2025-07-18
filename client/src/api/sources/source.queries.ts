import { useQuery } from "@tanstack/react-query";
import { getSources } from "./source.api";

export const FetchSources = () => {
	return useQuery({ queryKey: ["sources"], queryFn: getSources });
};
