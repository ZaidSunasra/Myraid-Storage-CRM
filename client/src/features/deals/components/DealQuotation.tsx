import { FetchQuotationByDeal } from "@/api/quotations/quotation.queries";
import ErrorDisplay from "@/shared/components/ErrorPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, IndianRupee, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

const DealQuotation = ({ deal_id }: { deal_id: string }) => {

    const { data, isPending, isError } = FetchQuotationByDeal(deal_id);
    const navigate = useNavigate();

    if (isPending) return <Skeleton className="h-4/5 w-3xs bg-background" />
    if (isError) return <div><ErrorDisplay /></div>

    return <Card className="cursor-pointer">
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Quotation History</span>
            </CardTitle>
            <CardDescription> Recent Quotations & Proposals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {data.quotations.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground font-medium">No quotations available</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Start creating quotations to see them here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.quotations.map((quotation) => (
                        <div key={quotation.id} className="border-l-4 border-blue-500 pl-4 py-2" onClick={() => navigate(`/quotation/${quotation.deal_id}/${quotation.id}`)}>
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm">{quotation.quotation_no}</h4>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <IndianRupee className="h-3 w-3 mr-1" />
                                        {quotation.grand_total}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {format(quotation.created_at, "dd-MM-yyyy")}
                                        </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
}

export default DealQuotation