import LandingPage from "@/features/auth/pages/LandingPage";
import AddLeadPage from "@/features/leads/pages/AddLeadPage";
import DetailedLeadPage from "@/features/leads/pages/DetailedLeadPage";
import EditLeadPage from "@/features/leads/pages/EditLeadPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import { BrowserRouter, Route, Routes } from "react-router"

const Router = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/lead" element={<LeadsPage />} />
                <Route path="/lead/:id" element={<DetailedLeadPage />} />
                <Route path="/lead/add" element={<AddLeadPage />} />
                <Route path="/lead/edit/:id" element={<EditLeadPage />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default Router;