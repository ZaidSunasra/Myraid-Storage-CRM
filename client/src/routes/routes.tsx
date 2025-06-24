import LandingPage from "@/features/auth/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router"

const Router = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element= {<LoginPage />} /> 
            </Routes>
        </BrowserRouter>
    </>
}

export default Router;