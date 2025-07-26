import { FetchSources } from "@/api/sources/source.queries";
import useQueryParams from "@/hooks/useQueryParams";
import PaginationControls from "@/shared/components/PaginationControl";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { capitalize, toTitleCase } from "@/utils/formatData";
import { format } from "date-fns";
import { Building2, CalendarIcon, ChevronsUpDown, Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";
import type { Assignee, GetSourceOutput } from "zs-crm-common";

const DealsTableBody = ({ data }: { data: any }) => {

    const { startDate, endDate, setDate, toggleSource, sources, rows } = useQueryParams();
    const [datePopoverOpen, setDatePopoverOpen] = useState<boolean>(false);
    const { data: sourceData, isError: sourceError, isPending: sourcePending } = FetchSources();
    const lastPage = Math.ceil((data?.totalDeals || 0) / rows) == 0 ? 1 : Math.ceil((data?.totalDeals || 0) / rows);

    if (sourcePending) return <>Loading..</>
    if (sourceError) return <>Error</>

    return <>
        <Table>
            <TableHeader >
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead >
                        <div className="flex justify-between items-center">
                            Source
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="ml-2" size="icon">
                                        <ChevronsUpDown className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-0">
                                    <Command>
                                        <CommandInput placeholder="Search sources..." />
                                        <CommandList>
                                            <CommandEmpty>No source found.</CommandEmpty>
                                            <CommandGroup>
                                                {sourceData?.sources.map((source: GetSourceOutput) => (
                                                    <CommandItem key={source.id}>
                                                        <Checkbox className="mr-2" checked={sources.includes(String(source.id))} onCheckedChange={() => toggleSource(String(source.id))} />
                                                        {toTitleCase(source.name)}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TableHead>
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.deals.map((deal: any) => (
                    <TableRow key={deal.id}>
                        <TableCell className="font-medium">
                            {capitalize(deal.client_detail.first_name)} {capitalize(deal.client_detail.last_name)}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2 " />
                                {toTitleCase(deal.company.name)}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {deal.client_detail?.emails[0]?.email == "" ? "No email provided" : deal.client_detail?.emails[0]?.email}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {deal.client_detail?.phones[0]?.phone || "No phone provided"}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {toTitleCase(deal.deal_status)}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                {deal.assigned_to.map((assignee: Assignee, idx: number) => (
                                    <div key={idx} className="flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        {assignee.user.first_name} {assignee.user.last_name}
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>{toTitleCase(deal.source.name)}</TableCell>
                        <TableCell>{format(deal.created_at, "dd/mm/yyyy hh:mm a")}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <PaginationControls lastPage={lastPage} />
    </>
}

export default DealsTableBody