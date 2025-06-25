import LoginPage from "./LoginPage";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/shared/components/ui/sheet";

const LandingPage = () => {

    return <div className="w-screen h-screen flex flex-col items-center justify-center font-mono bg-primary-foreground">
        <h1 className="font-extrabold text-5xl text-primary"> Myraid Storage Systems</h1>
        <div className="m-8">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="cursor-pointer text-xl">Login</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Login</SheetTitle>
                        <SheetDescription>
                            Welcome back! Please log in with your email and password to continue.
                        </SheetDescription>
                    </SheetHeader>
                    <LoginPage />
                </SheetContent>
            </Sheet>
        </div>
    </div >
}

export default LandingPage;
