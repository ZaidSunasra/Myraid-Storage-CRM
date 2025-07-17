import { FetchLeadById } from "@/api/leads/leads.queries";
import { useUser } from "@/context/UserContext";
import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { toast } from "sonner";
import type { department } from "zs-crm-common";


const ProtectedRoute = ({ allowedDepartment, checkOwnership = false }: { allowedDepartment: department[], checkOwnership?: boolean }) => {
    const location = useLocation();
    const { user } = useUser();
    const { id } = useParams();

    const shouldFetch = checkOwnership && user?.department === "sales" && Boolean(id);

    const { data, isPending, isError } = FetchLeadById(id || "");

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!allowedDepartment.includes(user?.department)) {
        toast.error("Unauthorized access");
        return <Navigate to="/" replace />;
    }

    if (shouldFetch) {
        if (isPending) return <div>Loading...</div>;
        const assignedIds = data?.lead?.assigned_to?.map((a: {user: {first_name: string, last_name: string, id: number}}) => a.user.id) || [];
        if (isError || !assignedIds.includes(user?.id)) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;

}

export default ProtectedRoute;