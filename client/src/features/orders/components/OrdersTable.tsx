import { FetchOrders } from "@/api/orders/orders.queries";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParams";
import ErrorDisplay from "@/shared/components/ErrorPage";
import TableLoader from "@/shared/components/loaders/TableLoader";
import SearchFilterBar from "@/shared/components/SearchFilter";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Button } from "@/shared/components/ui/button";
import { Building2, CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import PaginationControls from "@/shared/components/PaginationControl";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { format } from "date-fns";
import { calculateRemainingBalance, calculateTotalAmount, calculateTotalBody } from "../utils";
import { useNavigate } from "react-router";
import { useUser } from "@/context/UserContext";
import { DEPARTMENTS } from "zs-crm-common";

const OrdersTable = () => {

    const { rows, page, search, employeeIDs, startDate, endDate, setSearch, setSearchParams, setDate } = useQueryParams();
    const { data, isError, isPending } = FetchOrders({ rows, page, search, employeeIDs, startDate, endDate });
    const [searchInput, setSearchInput] = useState(search);
    const [datePopoverOpen, setDatePopoverOpen] = useState<boolean>(false);
    const debouncedSearch = useDebounce(searchInput, 500);
    const lastPage = Math.ceil((data?.totalOrders || 0) / rows) == 0 ? 1 : Math.ceil((data?.totalOrders || 0) / rows);
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        setSearch(debouncedSearch, search);
    }, [debouncedSearch, search, setSearchParams]);

    if (isPending) return <TableLoader />
    if (isError) return <ErrorDisplay message="Failed to display data. Refresh or please try again later" />

    console.log(data)

    return <Card className="mb-6 bg-background">
        <CardHeader>
            <SearchFilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader >
                    <TableRow>
                        <TableHead>Order No</TableHead>
                        <TableHead >
                            <div className="flex justify-between items-center">
                                Created
                                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="ml-2">
                                            <CalendarIcon className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="flex flex-col gap-4 w-auto">
                                        <div className="flex gap-4">
                                            <div>
                                                <div className="text-xs font-medium mb-1">Start Date</div>
                                                <Calendar mode="single" selected={startDate ? new Date(startDate) : undefined} onSelect={(date) => setDate(date, "start")} disabled={(date) => date > new Date()} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium mb-1">End Date</div>
                                                <Calendar mode="single" selected={endDate ? new Date(endDate) : undefined} onSelect={(date) => setDate(date, "end")} disabled={(date) => date > new Date()} />
                                            </div>
                                        </div>
                                        {(startDate || endDate) && (
                                            <Button variant="outline" size="sm" className="mt-2" onClick={() => setDate(undefined, "clear")}>
                                                <X className="h-4 w-4 mr-1" />
                                                Clear
                                            </Button>
                                        )}
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </TableHead>
                        <TableHead>Dispatch</TableHead>
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>PO Number</TableHead>}
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>Deal Number</TableHead>}
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>Amount</TableHead>}
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>Bill No</TableHead>}
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>Company</TableHead>}
                        <TableHead>Height</TableHead>
                        <TableHead>Body</TableHead>
                        <TableHead>Colour</TableHead>
                        {user?.department && user.department !== DEPARTMENTS[2] && <TableHead>Fittted By</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.orders.map((order: any) => {
                        const { remainingBalance } = calculateRemainingBalance(order)
                        return (
                            <TableRow key={order.id} onClick={() => navigate(`/order/${order.deal_id}/${order.id}`)} className={`${order.status == "dispatched" ? "bg-green-300 hover:bg-300" : ""}`}>
                                <TableCell className="font-medium">
                                    {order.order_number}
                                </TableCell>
                                <TableCell>{format(order.created_at, "dd/MM/yyyy")}</TableCell>
                                <TableCell>{format(order.dispatch_at, "dd/MM/yyyy")}</TableCell>
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell className={`${order.pi_number && order.status !== "dispatched" ? "bg-purple-400" : ""}`}>
                                    {order.po_number}
                                </TableCell>}
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell>
                                    {order.deal_id.replace(/-/g, "/").replace(/_/g, "-")}
                                </TableCell>}
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell>
                                    {remainingBalance}
                                </TableCell>}
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell>{order.bill_number}</TableCell>}
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell>
                                    <div className="flex items-center">
                                        <Building2 className="h-4 w-4 mr-2 " />
                                        {toTitleCase(order.deal.company.name)}
                                    </div>
                                </TableCell>}
                                <TableCell>
                                    {order.height}
                                </TableCell>
                                <TableCell>
                                    {order.total_body}
                                </TableCell>
                                <TableCell>
                                    {capitalize(order.colour)}
                                </TableCell>
                                {user?.department && user.department !== DEPARTMENTS[2] && <TableCell>
                                    {toTitleCase(order.fitted_by)}
                                </TableCell>}
                            </TableRow>
                        )
                    })}
                </TableBody>
                {user?.department && user.department !== DEPARTMENTS[2] && <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{calculateTotalAmount(data)}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{calculateTotalBody(data)}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>}
            </Table>
            <PaginationControls lastPage={lastPage} />
        </CardContent>
    </Card>

}

export default OrdersTable