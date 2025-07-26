import LandingPage from "@/features/auth/pages/LandingPage";
import CalenderPage from "@/features/calender/pages/CalenderPage";
import DealsPage from "@/features/deals/pages/DealsPage";
import AddLeadPage from "@/features/leads/pages/AddLeadPage";
import DetailedLeadPage from "@/features/leads/pages/DetailedLeadPage";
import EditLeadPage from "@/features/leads/pages/EditLeadPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import NotificationPage from "@/features/notifications/pages/NotificationPage";
import ProtectedRoute from "@/utils/checkPermission";
import { BrowserRouter, Route, Routes } from "react-router";
import { DEPARTMENTS } from "zs-crm-common";

const Router = () => {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/notifications" element={<NotificationPage />} />
					<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} />}>
						<Route path="/lead" element={<LeadsPage />} />
						<Route path="/lead/add" element={<AddLeadPage />} />
						<Route path="/calender" element={<CalenderPage />} />
						<Route path="/deal" element={<DealsPage />} />
					</Route>
					<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} checkOwnership />}>
						<Route path="/lead/:id" element={<DetailedLeadPage />} />
						<Route path="/lead/edit/:id" element={<EditLeadPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default Router;
