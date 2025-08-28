import LandingPage from "@/features/auth/pages/LandingPage";
import CalenderPage from "@/features/calender/pages/CalenderPage";
import AddDealPage from "@/features/deals/pages/AddDealPage";
import DealsPage from "@/features/deals/pages/DealsPage";
import DetailedDealPage from "@/features/deals/pages/DetailedDealPage";
import EditDealPage from "@/features/deals/pages/EditDealPage";
import AddLeadPage from "@/features/leads/pages/AddLeadPage";
import DetailedLeadPage from "@/features/leads/pages/DetailedLeadPage";
import EditLeadPage from "@/features/leads/pages/EditLeadPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import NotificationPage from "@/features/notifications/pages/NotificationPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";
import WorkInProgress from "@/shared/components/WorkInProgress";
import ProtectedRoute from "@/utils/routePermission";
import { BrowserRouter, Route, Routes } from "react-router";
import { DEPARTMENTS } from "zs-crm-common";

const Router = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/notifications" element={<NotificationPage />} />
			<Route path="/unauthorized-page" element={<UnauthorizedPage />} />
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} />}>
				<Route path="/lead" element={<LeadsPage />} />
				<Route path="/lead/add" element={<AddLeadPage />} />
				<Route path="/deal/add" element={<AddDealPage />} />
				<Route path="/calender" element={<CalenderPage />} />
				<Route path="/setting" element={<SettingsPage />} />
				<Route path="/quotation" element={<WorkInProgress />} />
				<Route path="/order" element={<WorkInProgress />} />
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} checkOwnership type="lead" />}>
				<Route path="/lead/:id" element={<DetailedLeadPage />} />
				<Route path="/lead/edit/:id" element={<EditLeadPage />} />
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1], DEPARTMENTS[3]]} />}>
				<Route path="/deal" element={<DealsPage />} />
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} checkOwnership type="deal" />}>
				<Route path="/deal/edit/:id" element={<EditDealPage />} />
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1], DEPARTMENTS[3]]} checkOwnership type="deal" />}>
				<Route path="/deal/:id" element={<DetailedDealPage />} />
			</Route>
		</Routes>
	</BrowserRouter>
};

export default Router;
