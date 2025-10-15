import { FetchDealById } from "@/api/deals/deal.queries"
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { ArrowLeft, Edit, ReceiptIndianRupee } from "lucide-react";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";
import DealDetails from "../components/DealDetails";
import { type deal_status, type GetDealOutput } from "zs-crm-common";
import { Badge } from "@/shared/components/ui/badge";
import { DEAL_STATUS_META } from "@/utils/customStyle";
import Description from "@/shared/components/Description";
import MeetScheduling from "@/shared/components/MeetScheduling";
import ScheduledMeeting from "@/shared/components/ScheduledMeeting";
import DrawingUploads from "../../../shared/components/DrawingUploads";
import { useUser } from "@/context/UserContext";
import DrawingList from "../../../shared/components/DrawingList";
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader";
import ErrorDisplay from "@/shared/components/ErrorPage";
import DealQuotation from "../components/DealQuotation";
import { usePermissions } from "@/context/PermissionContext";

const DetailedDealPage = () => {

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "info";
    const { data: dealData, isPending: dealPending, isError: dealError } = FetchDealById(id as string);
    const { user } = useUser();
    const { canView } = usePermissions();
    const navigate = useNavigate();

    if (dealPending) return <DetailedPageLoader />
    if (dealError) return <ErrorDisplay fullPage />
    const { bg, icon: StatusIcon } = DEAL_STATUS_META[dealData?.deal?.deal_status as deal_status]

    return <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-0 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 p-2 sm:p-0 gap-4">
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
                        <div className="ml-4">
                            <Badge className={bg}>
                                <StatusIcon />
                                {capitalize(dealData?.deal?.deal_status as string)}
                            </Badge>
                        </div>
                    </div>
                    {user?.department && canView(user?.department, "add_deal") &&
                        <Button onClick={() => navigate(`/deal/edit/${id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Deal
                        </Button>
                    }
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Tabs defaultValue={tab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-background">
                            <TabsTrigger value="info"> Deal Information</TabsTrigger>
                            {user?.department && canView(user?.department, "schedule_meeting") &&
                                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                            }
                            <TabsTrigger value="drawing">Drawings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="space-y-6">
                            <DealDetails data={dealData?.deal as GetDealOutput} />
                            {user?.department && canView(user?.department, "add_description") && <Description id={dealData?.deal?.id as string} type="deal" />}
                        </TabsContent>
                        {user?.department && canView(user?.department, "schedule_meeting") &&
                            <TabsContent value="scheduling" className="space-y-6">
                                <MeetScheduling type="deal" id={id as string} />
                                <ScheduledMeeting type="deal" id={id as string} />
                            </TabsContent>
                        }
                        <TabsContent value="drawing" className="space-y-6">
                            <DrawingUploads context="deal" />
                            <DrawingList context="deal" />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="lg:col-span-1">
                    {user?.department && canView(user.department, "add_quotation") &&
                        <div className="w-full">
                            <Button className="mb-8 text-white flex gap-2 px-6 py-2 shadow-md transition w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => navigate(`/quotation/add/${id}`)}
                            >
                                <ReceiptIndianRupee className="w-4 h-4" />
                                Create Quotation
                            </Button>
                        </div>
                    }
                    {user?.department && canView(user.department, "add_order") && dealData.deal?.deal_status !== "order_confirmed" &&
                        <Button className="mb-4 w-full" onClick={() => navigate(`/order/add/${id}`)}>Convert to Order</Button>
                    }
                    {dealData.deal?.deal_status === "order_confirmed" &&
                        <Badge className="font-medium mb-4 text-center w-full text-sm p-2">Order has been created for this deal</Badge>
                    }
                    {user?.department && canView(user.department, "view_deal_quotation") &&
                        <DealQuotation deal_id={id as string} />
                    }
                </div>
            </div>
        </div>
    </div>

}

export default DetailedDealPage