import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Label } from "@/shared/components/ui/label"
import { toTitleCase } from "@/utils/formatData"
import { format } from "date-fns"
import { User } from "lucide-react"
import type { Assignee, Order } from "zs-crm-common"

const OrderDetails = ({ data }: { data: Order }) => {
    return <Card className="bg-background">
        <CardHeader>
            <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Order No</Label>
                    <span>{data.order_number}</span>
                </div>
                <div className="space-y-2">
                    <Label>Bill No</Label>
                    <span>{data.bill_number}</span>
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <span>{toTitleCase(data.status)}</span>
                </div>
                <div className="space-y-2">
                    <Label>PO Number</Label>
                    <div className="space-y-1">
                        {data.po_number ?? "PO Number not provided"}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>PI Number</Label>
                    <div className="space-y-1">
                        {data.pi_number ? "True" : "False"}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Colour</Label>
                    <div className="space-y-1">
                        {toTitleCase(data.colour)}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Height</Label>
                    <div className="space-y-1">
                        {data.height}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Total Body</Label>
                    <div className="space-y-1">
                        {data.total_body}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="space-y-1">
                        {data.balance}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Dispatch Date</Label>
                    <span>{format(data.dispatch_at, "dd/MM/yyyy")}</span>
                </div>
                <div className="space-y-2">
                    <Label>Created At</Label>
                    <span>{format(data.created_at, "dd/MM/yyyy")}</span>
                </div>
                <div className="space-y-2">
                    <Label>Quotation No</Label>
                    <span>{data.quotation.quotation_no}</span>
                </div>
                <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <div className="space-y-1">
                        {data.deal.assigned_to.map((assignee: Assignee) => (
                            <div key={assignee.user.id} className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                <span>
                                    {assignee.user.first_name} {assignee.user.last_name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
}

export default OrderDetails