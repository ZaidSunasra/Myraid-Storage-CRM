import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "./permission.api";

export const FetchPermissions = () => {
    return useQuery({
        queryKey: ["permissions"],
        queryFn: getPermissions
    });
};