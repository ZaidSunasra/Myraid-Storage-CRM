import { FetchDealById } from "@/api/deals/deal.queries"
import LeadSideBar from "@/features/leads/components/LeadSidebar";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { ArrowLeft, Edit } from "lucide-react";
import { NavLink, useParams } from "react-router";

const DetailedDealPage = () => {

    const { id } = useParams()
    const { data: dealData, isPending: dealPending } = FetchDealById(id as string);

    if (dealPending) return <>Loading...</>

    console.log(dealData);

    return <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-0 py-6">
                <div className="flex items-center justify-between mb-6 ">
                    <div className="flex items-center">
                        <NavLink to="/deal">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </NavLink>
                        <div>
                            <h1 className="text-2xl font-bold ">
                                {capitalize(dealData?.deal?.client_detail.first_name as string)} {capitalize(dealData?.deal?.client_detail.last_name as string)}
                            </h1>
                            <p className="text-gray-600">{toTitleCase(dealData?.deal?.company.name as string)}</p>
                        </div>
                    </div>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Deal
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-background">
                            <TabsTrigger value="info"> Deal Information</TabsTrigger>
                            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                            <TabsTrigger value="drawing">Drawings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="space-y-6">
                        </TabsContent>
                        <TabsContent value="scheduling" className="space-y-6">
                        </TabsContent>
                        <TabsContent value="drawing" className="space-y-6">
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="lg:col-span-1">
                    <LeadSideBar />
                </div>
            </div>
        </div>
    </div>

}

export default DetailedDealPage