import { FetchDealById } from "@/api/deals/deal.queries";
import { FetchLeadById } from "@/api/leads/leads.queries";
import { usePermissions } from "@/context/PermissionContext";
import { useUser } from "@/context/UserContext";
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader";
import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { DEPARTMENTS, type Assignee, type department } from "zs-crm-common";

const ProtectedRoute = ({ allowedDepartment, checkOwnership = false, type, permissionKey }: { allowedDepartment?: department[]; checkOwnership?: boolean; type?: "deal" | "lead", permissionKey?: string}) => {
	const location = useLocation();
	const { user } = useUser();
	const { id } = useParams();
	const { canView, isLoading } = usePermissions();

	if (!user) return <Navigate to="/" state={{ from: location }} replace />;
	if (isLoading) return <DetailedPageLoader />;

	if (allowedDepartment && !allowedDepartment.includes(user.department)) {
		return <Navigate to="/unauthorized-page" replace />;
	}

	if (permissionKey && !canView(user.department, permissionKey)) {
		return <Navigate to="/unauthorized-page" replace />;
	}

	if (checkOwnership && user?.department === DEPARTMENTS[0] && Boolean(id)) {
		if (type === "lead") {
			const { data, isPending, isError } = FetchLeadById(id as string);
			if (isPending) return <DetailedPageLoader />;
			const assignedIds = data?.lead?.assigned_to?.map((a: Assignee) => a.user.id) || [];
			if (isError || !assignedIds.includes(user?.id)) return <Navigate to="/unauthorized-page" replace />;
		} else {
			const { data, isPending, isError } = FetchDealById(id as string);
			if (isPending) return <DetailedPageLoader />;
			const assignedIds = data?.deal?.assigned_to?.map((a: Assignee) => a.user.id) || [];
			if (isError || !assignedIds.includes(user?.id)) return <Navigate to="/unauthorized-page" replace />;
		}
	}

	return <Outlet />;
};

export default ProtectedRoute;
