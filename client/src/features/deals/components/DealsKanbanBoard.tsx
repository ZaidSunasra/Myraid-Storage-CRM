import { useEditStatus } from "@/api/deals/deal.mutation";
import { usePermissions } from "@/context/PermissionContext";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { DEAL_STATUS_META } from "@/utils/customStyle";
import { toTitleCase } from "@/utils/formatData";
import { Building2, FileText, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { DEAL_STATUS, type deal_status, type GetAllDealSuccessResponse, type GetDealOutput } from "zs-crm-common";

const KanbanBoard = ({ data }: { data: GetAllDealSuccessResponse }) => {

    const editStatus = useEditStatus();
    const navigate = useNavigate();
    const {user} = useUser();4
    const {canView} = usePermissions();

    const handleStatus = ({ id, status }: { id: string, status: deal_status }) => {
        editStatus.mutate({ id, status })
    }

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
                                                            <span className="text-xs font-medium text-foreground">{deal.id.replace(/-/g, "/").replace(/_/g, "-")}</span>
                                                        </div>
                                                       {user?.department && canView(user.department, "edit_deal_status") && deal.deal_status !== "order_confirmed" && <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-5 w-5">
                                                                    <MoreHorizontal className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {DEAL_STATUS.filter((s) => s !== deal.deal_status && s !== "order_confirmed").map((status) => (
                                                                    <DropdownMenuItem key={status} onClick={(e) => { e.stopPropagation(), handleStatus({ id: deal.id, status }) }} disabled={editStatus.isPending}>Move to {toTitleCase(status)}</DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Building2 className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {toTitleCase(deal.company.name)}
                                                        </span>
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