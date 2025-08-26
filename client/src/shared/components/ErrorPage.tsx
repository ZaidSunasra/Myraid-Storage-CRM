import ErrorSVG from "@/assets/crashed-error.svg";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { navItems } from "@/utils/getNavigationLink";
import { useUser } from "@/context/UserContext";
import type { department } from "zs-crm-common";

interface ErrorProps {
    message?: string;
    fullPage?: boolean;
}

const ErrorDisplay = ({ message = "Please try again later ✨", fullPage = false }: ErrorProps) => {

    const navigate = useNavigate();
    const { user } = useUser();

    return <div className={`flex flex-col items-center justify-center ${fullPage ? "w-screen h-screen" : "w-full h-full"}  bg-accent text-gray-800`} >
        <img src={ErrorSVG} alt="Error" className="w-60 h-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-base text-gray-600 mb-4">{message}</p>
        {fullPage && (
            <Button onClick={() => navigate(navItems[user?.department as department][0].url)}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-md hover:bg-indigo-600 transition" >
                Go Back Home
            </Button>
        )}
    </div >
}
export default ErrorDisplay;