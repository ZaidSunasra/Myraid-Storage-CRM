import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./product.api";

export const FetchProducts = () => {
	return useQuery({ queryKey: ["products"], queryFn: getProducts });
};
