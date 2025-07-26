import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { type Assignee, type GetLeadOutput, type GetSourceOutput } from "zs-crm-common";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParams";
import { FetchLeads } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Calendar } from "@/shared/components/ui/calendar";
import { Building2, Mail, Phone, User, ChevronsUpDown, CalendarIcon, X } from "lucide-react";
import { FetchSources } from "@/api/sources/source.queries";
import LeadTableLoader from "./loaders/LeadTableLoader";
import { capitalize, toTitleCase } from "@/utils/formatData";
import PaginationControls from "@/shared/components/PaginationControl";
import SearchFilterBar from "@/shared/components/SearchFilter";

const LeadsTable = () => {
	const { page, rows, search, employeeIDs, sources, startDate, endDate, toggleSource, setDate, setSearch, setSearchParams } = useQueryParams();
	const navigate = useNavigate();
	const [datePopoverOpen, setDatePopoverOpen] = useState(false);
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebounce(searchInput, 500);
	const { data: leadsData, isPending: leadsPending, isError: leadsError } = FetchLeads({ page, search, employeeIDs, rows, startDate, endDate, selectedSources: sources });
	const { data: sourceData, isError: sourceError, isPending: sourcePending } = FetchSources();
	const lastPage = Math.ceil((leadsData?.totalLeads || 0) / rows) == 0 ? 1 : Math.ceil((leadsData?.totalLeads || 0) / rows);

	useEffect(() => {
		setSearch(debouncedSearch, search);
	}, [debouncedSearch, search, setSearchParams]);

	if (leadsPending || sourcePending) return <LeadTableLoader />;

	if (leadsError || sourceError) return <>Error while loading page</>;

	return (
		<Card className="mb-6 bg-background">
			<CardHeader>
				<SearchFilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Company</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead className="flex justify-between items-center">
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
														{sourceData.sources.map((source: GetSourceOutput) => (
															<CommandItem key={source.id}>
																<Checkbox className="mr-2" checked={sources.includes(String(source.id))} onCheckedChange={() => toggleSource(String(source.id))} />
																{source.name.replace(/\b\w/g, (c: string) => c.toUpperCase())}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
								</TableHead>
								<TableHead>Assigned To</TableHead>
								<TableHead>Product</TableHead>
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
							{leadsData.leads.map((lead: GetLeadOutput) => (
								<TableRow key={lead.id} className="text-accent-foreground" onClick={() => navigate(`/lead/${lead.id}`)}>
									<TableCell>
										<div className="font-medium">
											{capitalize(lead.client_detail.first_name)} {capitalize(lead.client_detail.last_name)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center">
											<Building2 className="h-4 w-4 mr-2 " />
											{toTitleCase(lead.company.name)}
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center text-sm">
												<Mail className="h-3 w-3 mr-1" />
												{lead.client_detail?.emails[0]?.email == "" ? "No email provided" : lead.client_detail?.emails[0]?.email}
											</div>
											<div className="flex items-center text-sm">
												<Phone className="h-3 w-3 mr-1" />
												{lead.client_detail?.phones[0]?.phone || "No phone provided"}
											</div>
										</div>
									</TableCell>
									<TableCell>{lead.source.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase())}</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											{lead.assigned_to.map((assignee: Assignee) => (
												<div className="flex items-center" key={assignee.user.id}>
													<User className="h-4 w-4 mr-2" />
													{assignee.user.first_name} {assignee.user.last_name}
												</div>
											))}
										</div>
									</TableCell>
									<TableCell>{lead.product.name.replace(/\b\w/g, (char: string) => char.toUpperCase())}</TableCell>
									<TableCell>{new Date(lead.created_at).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter className="flex justify-center gap-4">
				<PaginationControls lastPage={lastPage} />
			</CardFooter>
		</Card>
	);
};

export default LeadsTable;
