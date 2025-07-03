import LandingPage from "@/features/auth/pages/LandingPage";
import AddLeadPage from "@/features/leads/pages/AddLeadPage";
import DetailedLeadPage from "@/features/leads/pages/DetailedLeadPage";
import EditLeadPage from "@/features/leads/pages/EditLeadPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import ProtectedRoute from "@/utils/checkPermission";
import { BrowserRouter, Route, Routes } from "react-router"
import { DEPARTMENTS } from "zs-crm-common";

const Router = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]} />} >
                    <Route path="/lead" element={<LeadsPage />} />
                    <Route path="/lead/add" element={<AddLeadPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedDepartment={[DEPARTMENTS[0], DEPARTMENTS[1]]}  checkOwnership />} >
                    <Route path="/lead/:id" element={<DetailedLeadPage />} />
                    <Route path="/lead/edit/:id" element={<EditLeadPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
}

export default Router;