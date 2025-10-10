import { FetchQuotation } from "@/api/quotations/quotation.queries"
import ErrorPage from "@/shared/components/ErrorPage";
import TableLoader from "@/shared/components/loaders/TableLoader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParams";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shared/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { ArrowDown, ArrowUp, CalendarIcon, Check, ChevronsUpDown, Clock, X } from "lucide-react";
import { toTitleCase } from "@/utils/formatData";
import PaginationControls from "@/shared/components/PaginationControl";
import SearchFilterBar from "@/shared/components/SearchFilter";
import { format } from "date-fns";
import { Command, CommandGroup, CommandItem, CommandList } from "@/shared/components/ui/command";

const QuotationTable = () => {

    const { rows, page, search, employeeIDs, startDate, endDate, setSearch, setDate, sortOrder, sortBy, setSort } = useQueryParams();
    const [datePopoverOpen, setDatePopoverOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 500);
    const { data: quotationData, isError: quotationError, isLoading: quotationLoading } = FetchQuotation({ page, search, employeeIDs, rows, startDate, endDate, sortBy, sortOrder });
    const lastPage = Math.ceil((quotationData?.totalQuotations || 0) / rows) == 0 ? 1 : Math.ceil((quotationData?.totalQuotations || 0) / rows);

    useEffect(() => {
        setSearch(debouncedSearch, search);
    }, [debouncedSearch, search, setSearch]);

    if (quotationLoading) return <TableLoader />;
    if (quotationError) return <ErrorPage message="Failed to load data. Refresh or try again later" />;

    return <Card className="mb-6 bg-background">
        <CardHeader>
            <SearchFilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer select-none">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="flex justify-between w-full">
                                            Quotation No
                                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup heading="Sort By">
                                                    <CommandItem onSelect={() => setSort(null)} className="flex items-center gap-2" >
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        Default (Latest)
                                                        {sortBy === "created_at" && sortOrder === "desc" && (
                                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                                        )}
                                                    </CommandItem>
                                                    <CommandItem onSelect={() => setSort("quotation_no", "asc")} className="flex items-center gap-2" >
                                                        <ArrowUp className="h-4 w-4 text-muted-foreground" />
                                                        Quotation No 
                                                        {sortBy === "quotation_no" && sortOrder === "asc" && (
                                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                                        )}
                                                    </CommandItem>
                                                    <CommandItem onSelect={() => setSort("quotation_no", "desc")} className="flex items-center gap-2"  >
                                                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                                                        Quotation No 
                                                        {sortBy === "quotation_no" && sortOrder === "desc" && (
                                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                                        )}
                                                    </CommandItem>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="flex justify-between items-center">
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
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotationData?.convertedQuotation?.map((quotation) => (
                            <TableRow key={quotation.id} onClick={() => navigate(`/quotation/${quotation.deal_id}/${quotation.id}`)}>
                                <TableCell className="font-medium">{quotation.quotation_no.replace(/-/g, "/").replace(/_/g, "-")}</TableCell>
                                <TableCell>{toTitleCase(quotation.deal.company.name)}</TableCell>
                                <TableCell>
                                    {toTitleCase(quotation.quotation_products[0].name)}
                                    {quotation.quotation_products.length > 1 ? ` + ${quotation.quotation_products.length - 1} Product` : ` `}
                                </TableCell>
                                <TableCell>{quotation.grand_total}</TableCell>
                                <TableCell>{format(quotation.created_at, "dd-MM-yyyy")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
        <PaginationControls lastPage={lastPage} />
    </Card>

}

export default QuotationTable