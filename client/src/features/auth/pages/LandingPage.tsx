import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router";

const LandingPage = () => {

    const navigate = useNavigate();
    
    return <div className="w-screen h-screen flex flex-col items-center justify-center font-mono bg-primary-foreground">
        <h1 className="font-extrabold text-5xl text-primary"> Myraid Storage Systems</h1>
        <div className="m-8">
            <Button className="text-3xl p-8 bg-accent-foreground cursor-pointer" onClick={() => navigate("/login")}>
                Login
            </Button>
        </div>

    </div>
}

export default LandingPage;