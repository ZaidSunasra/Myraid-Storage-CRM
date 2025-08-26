import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { NavLink, useParams } from "react-router"
import { type GetDealOutput } from "zs-crm-common"
import { FetchDealById } from "@/api/deals/deal.queries"
import EditDealDetails from "../components/EditDealForm"
import EditPageLoader from "@/shared/components/loaders/EditPageLoader"
import ErrorDisplay from "@/shared/components/ErrorPage"


const EditDealPage = () => {

    const { id } = useParams()
    const { data, isPending, isError } = FetchDealById(id as string)

    if (isPending) return <EditPageLoader showSidebar={false} />
    if (isError) return <ErrorDisplay message="Failed to load data. Refresh or please try again later" fullPage/>

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to={`/deal/${id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit New Deal</h1>
                        <p className="text-muted-foreground">Create a new deal in your CRM system</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-4">
                        <EditDealDetails data={data?.deal as GetDealOutput} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default EditDealPage