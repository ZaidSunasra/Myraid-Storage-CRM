import { useEditStatus } from "@/api/deals/deal.mutation";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { format } from "date-fns";
import { Building2, CheckCircle, Clock, FileText, Globe, Handshake, Mail, MoreHorizontal, Package, Pencil, Phone, Target, User, UserRound, X, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { DEAL_STATUS, type Assignee, type deal_status, type GetAllDealSuccessResponse, type GetDealOutput } from "zs-crm-common";

const KanbanBoard = ({ data }: { data: GetAllDealSuccessResponse }) => {

    const editStatus = useEditStatus();
    const navigate = useNavigate();

    const handleStatus = ({ id, status }: { id: string, status: deal_status }) => {
        editStatus.mutate({ id, status })
    }

    const DEAL_STATUS_META: Record<deal_status, { icon: LucideIcon, bg: string }> = {
        pending: { icon: Clock, bg: "bg-gradient-to-r from-gray-500 to-gray-600" },
        drawing: { icon: Pencil, bg: "bg-gradient-to-r from-blue-500 to-blue-600" },
        quotation: { icon: FileText, bg: "bg-gradient-to-r from-amber-500 to-amber-600" },
        high_order_value: { icon: Target, bg: "bg-gradient-to-r from-purple-500 to-purple-600" },
        negotiation: { icon: Handshake, bg: "bg-gradient-to-r from-orange-500 to-orange-600" },
        order_lost: { icon: X, bg: "bg-gradient-to-r from-red-500 to-red-600" },
        order_confirmed: { icon: CheckCircle, bg: "bg-gradient-to-r from-green-500 to-green-600" }
    };

    const groupByStatus = data.deals.reduce((acc: Record<string, GetDealOutput[]>, deal: GetDealOutput) => {
        const status = deal.deal_status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(deal);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg">
            {DEAL_STATUS.map((status: deal_status) => {
                const items = groupByStatus[status] || [];
                const { icon: StatusIcon, bg } = DEAL_STATUS_META[status];
                return (
                    <Card key={status} className="p-0 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-background backdrop-blur-sm">
                        <div className={`p-4 border-b flex items-center justify-between rounded-t-lg  text-white  ${bg}`}>
                            <div className="flex items-center space-x-2">
                                <div className="p-1 bg-white/20 rounded-full">
                                    <StatusIcon className="h-3 w-3" />
                                </div>
                                <h2 className="font-semibold text-sm">{toTitleCase(status)}</h2>
                            </div>
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                {items.length}
                            </Badge>
                        </div>
                        <ScrollArea className="flex-1 max-h-96">
                            <div className="p-3 space-y-3">
                                {items.length > 0 ? (
                                    items.map((deal: GetDealOutput) => (
                                        <Card key={deal.id} onClick={() => navigate(`/deal/${deal.id}`)} className="group cursor-pointer hover:shadow-md transition-all duration-200 border border-border/50 hover:border-primary/30 p-0">
                                            <CardContent className="p-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Building2 className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs font-medium text-foreground">{toTitleCase(deal.company.name)}</span>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-5 w-5">
                                                                    <MoreHorizontal className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {DEAL_STATUS.filter((s) => s !== deal.deal_status).map((status) => (
                                                                    <DropdownMenuItem key={status} onClick={() => handleStatus({ id: deal.id, status })} disabled={editStatus.isPending}>Move to {toTitleCase(status)}</DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {capitalize(deal.client_detail.first_name)} {capitalize(deal.client_detail.last_name)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">{toTitleCase(deal.product.name)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">{toTitleCase(deal.source.name)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {deal.client_detail?.emails[0]?.email == "" ? "No email provided" : deal.client_detail?.emails[0]?.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">{deal.client_detail.phones[0].phone}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <UserRound className="h-3 w-3 text-muted-foreground" />
                                                        {deal.assigned_to.map((assignee: Assignee) =>
                                                            <span key={assignee.user.id} className="text-xs text-muted-foreground">{assignee.user.first_name} {assignee.user.last_name}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">{format(deal.created_at, "dd/mm/yyyy hh:mm a")}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="p-3 bg-muted/50 rounded-full mb-3">
                                            <FileText className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">No deals currently in {toTitleCase(status)}</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                );
            })}
        </div >
    );
};

export default KanbanBoard;