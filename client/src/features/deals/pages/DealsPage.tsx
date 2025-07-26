import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import DealsTable from "../components/DealsTable";

const DealsPage = () => {

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Deals</h1>
                    <p className="text-muted-foreground">Manage your sales pipeline and track deal progress</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                </Button>
            </div>
            <DealsTable />
        </div>
    </div>
}

export default DealsPage