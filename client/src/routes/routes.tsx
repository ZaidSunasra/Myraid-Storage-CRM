import LandingPage from "@/features/auth/pages/LandingPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
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
import AddOrderPage from "@/features/orders/pages/AddOrderPage";
import DetailedOrderPage from "@/features/orders/pages/DetailedOrderPage";
import EditOrderPage from "@/features/orders/pages/EditOrderPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import AddQuotationPage from "@/features/quotation/pages/AddQuotationPage";
import DetailedQuotationPage from "@/features/quotation/pages/DetailedQuotationPage";
import EditQuotationPage from "@/features/quotation/pages/EditQuotationPage";
import QuotationPrint from "@/features/quotation/pages/QuotationPrintPage";
import QuotationsPage from "@/features/quotation/pages/QuotationsPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import UnauthorizedPage from "@/shared/components/UnauthorizedPage";
import ProtectedRoute from "@/utils/routePermission";
import { BrowserRouter, Route, Routes } from "react-router";
import { DEPARTMENTS } from "zs-crm-common";

const Router = () => {
	return <BrowserRouter>
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/notifications" element={<NotificationPage />} />
			<Route path="/profile" element={<ProfilePage />} />
			<Route path="/unauthorized-page" element={<UnauthorizedPage />} />
			<Route element={<ProtectedRoute permissionKey="add_lead" />} >
				<Route path="/lead/add" element={<AddLeadPage />} />
				<Route element={<ProtectedRoute checkOwnership type="lead" />}>
					<Route path="/lead/edit/:id" element={<EditLeadPage />} />
				</Route>
			</Route>
			<Route element={<ProtectedRoute permissionKey="add_deal" />} >
				<Route path="/deal/add" element={<AddDealPage />} />
				<Route element={<ProtectedRoute checkOwnership type="deal" />}>
					<Route path="/deal/edit/:id" element={<EditDealPage />} />
				</Route>
			</Route>
			<Route element={<ProtectedRoute permissionKey="add_quotation" checkOwnership type="deal" />} >
				<Route path="/quotation/add/:id" element={<AddQuotationPage />} />
				<Route path="/quotation/edit/:id/:quotation_id" element={< EditQuotationPage />} />
			</Route>
			<Route element={<ProtectedRoute permissionKey="add_order" checkOwnership type="deal" />} >
				<Route path="/order/add/:id" element={<AddOrderPage />} />
				<Route path="/order/edit/:id/:order_id" element={<EditOrderPage />} />
			</Route>
			<Route element={<ProtectedRoute permissionKey="view_quotation" checkOwnership type="deal" />} >
				<Route path="/quotation/print/:id/:quotation_id" element={< QuotationPrint />} />
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} />}>
				<Route path="/lead" element={<LeadsPage />} />
				<Route path="/quotation" element={<QuotationsPage />} />
				<Route path="/calender" element={<CalenderPage />} />
				<Route path="/setting" element={<SettingsPage />} />
				<Route element={<ProtectedRoute checkOwnership type="deal" />}>
					<Route path="/quotation/:id/:quotation_id" element={<DetailedQuotationPage />} />
				</Route>
				<Route element={<ProtectedRoute checkOwnership type="lead" />}>
					<Route path="/lead/:id" element={<DetailedLeadPage />} />
				</Route>
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1], DEPARTMENTS[3]]} />}>
				<Route path="/deal" element={<DealsPage />} />
				<Route element={<ProtectedRoute checkOwnership type="deal" />}>
					<Route path="/deal/:id" element={<DetailedDealPage />} />
				</Route>
			</Route>
			<Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1], DEPARTMENTS[2], DEPARTMENTS[4]]} />}>
				<Route path="/order" element={<OrdersPage />} />
				<Route element={<ProtectedRoute checkOwnership type="deal" />}>
					<Route path="/order/:id/:order_id" element={<DetailedOrderPage />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
};

export default Router;
