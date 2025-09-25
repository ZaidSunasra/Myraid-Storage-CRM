import { FetchQuotationById } from "@/api/quotations/quotation.queries";
import { useUser } from "@/context/UserContext";
import ErrorDisplay from "@/shared/components/ErrorPage";
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toTitleCase } from "@/utils/formatData";
import { canView } from "@/utils/viewPermission";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { NavLink, useParams } from "react-router"
import QuotationDetails from "../component/QuotationDetails";
import QuotationWorkingDetails from "../component/QuotationWorkingDetails";

const DetailedQuotationPage = () => {

    const { id, quotation_id } = useParams();
    const { data, isError, isPending } = FetchQuotationById(quotation_id as string);
    const { user } = useUser();

    if (isPending) return <DetailedPageLoader />
    if (isError) return <ErrorDisplay fullPage />

    return <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-0 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 p-2 sm:p-0 gap-4">
                    <div className="flex items-center">
                        <NavLink to={`/deal/${id}`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </NavLink>
                        <div>
                            <h1 className="text-2xl font-bold ">
                                {data.quotation.quotation_products.length > 1 ? 
                                toTitleCase(data.quotation.quotation_products[0].name) + ` & ${data.quotation.quotation_products.length - 1} Other Product`
                                : toTitleCase(data.quotation.quotation_products[0].name)}
                            </h1>
                            <p className="text-gray-600">{toTitleCase(data.quotation.deal.company.name)}</p>
                        </div>
                    </div>
                    {user?.department && canView(user?.department, "admin") &&
                        <Button>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Quotation
                        </Button>
                    }
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-4">
                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 bg-background">
                            <TabsTrigger value="info">
                                Quotation Information
                            </TabsTrigger>
                            {user?.department && canView(user?.department, "admin") &&
                                <TabsTrigger value="working">
                                    Quotation Working
                                </TabsTrigger>
                            }
                        </TabsList>
                        <TabsContent value="info" className="space-y-6">
                            <QuotationDetails data={data.quotation} />
                        </TabsContent>
                        <TabsContent value="working" className="space-y-6">
                            <QuotationWorkingDetails data={data.quotation} />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="lg:col-span-1">
                    <div className="w-full">
                        <Button className="mb-8 text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full bg-blue-600 hover:bg-blue-700"
                         onClick={() => window.open(`/quotation/print/${id}/${quotation_id}`, "_blank")}
                         >
                            <FileText className="w-4 h-4" />
                            View Quotation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

}

export default DetailedQuotationPage