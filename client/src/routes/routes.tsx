import LandingPage from "@/features/auth/pages/LandingPage";
import LeadLayoutPage from "@/features/leads/pages/LeadLayoutPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import { BrowserRouter, Route, Routes } from "react-router"

const Router = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/lead" element={<LeadsPage />} />
                <Route path="/lead/:id" element={<LeadLayoutPage />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default Router;