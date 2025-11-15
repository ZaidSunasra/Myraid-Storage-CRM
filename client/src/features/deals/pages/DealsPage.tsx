import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import DealsTable from "../components/DealsTable";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
import { usePermissions } from "@/context/PermissionContext";

const DealsPage = () => {

    const { user } = useUser();
    const navigate = useNavigate();
    const {canView} = usePermissions();

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col p-2 sm:p-0 sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Deals</h1>
                    <p className="text-muted-foreground">Manage your sales pipeline and track deal progress</p>
                </div>
                {user?.department && canView(user.department, "add_deal") &&
                    <Button onClick={() => navigate("/deal/add")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Deal
                    </Button>
                }
            </div>
            <DealsTable />
        </div>
    </div>
}

export default DealsPage