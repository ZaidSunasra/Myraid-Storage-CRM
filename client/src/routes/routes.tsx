import LandingPage from "@/features/auth/pages/LandingPage";
import LeadsPage from "@/features/leads/pages/LeadsPage";
import { BrowserRouter, Route, Routes } from "react-router"

const Router = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/lead" element={<LeadsPage />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default Router;