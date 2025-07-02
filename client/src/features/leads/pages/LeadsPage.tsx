import LeadsTable from "../components/LeadsTable";
import { Button } from "@/shared/components/ui/button";
import Navbar from "@/shared/components/Navbar";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";


const LeadsPage = () => {

    const navigate = useNavigate();

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Leads</h1>
                    <p className="text-muted-foreground">Manage and track your sales leads</p>
                </div>
                <Button onClick={() => navigate("/lead/add")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                </Button>
            </div>
            <LeadsTable />
        </div>
    </div>
}

export default LeadsPage;