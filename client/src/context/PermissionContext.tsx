import { FetchPermissions } from "@/api/permissions/permissions.queries";
import { createContext, useContext, type ReactNode } from "react";
import type { department, GetPermissionOutput } from "zs-crm-common";

type PermissionContextType = {
    permissions: GetPermissionOutput[];
    isLoading: boolean,
   canView: (userDept: department, permissionKey: string) => boolean;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = FetchPermissions();
    const permissions = data?.permissions ?? [];
    const canView = (userDept: department, permissionKey: string) => {
        const permission = permissions.find((p: GetPermissionOutput) => p.permission_key === permissionKey);
        if (!permission) return false;
        return permission.allowed_dept.includes(userDept);
    };
    return <PermissionContext.Provider value={{ permissions, isLoading, canView }}>{children}</PermissionContext.Provider>;
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) throw new Error("Must be used inside PermissionProvider");
    return context;
};
