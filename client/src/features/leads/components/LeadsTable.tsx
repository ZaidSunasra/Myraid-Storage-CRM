import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DEPARTMENTS, type Assignee, type GetEmployeeOutput, type GetLeadOutput, type GetSourceOutput } from "zs-crm-common";
import useDebounce from "@/hooks/useDebounce";
import { toggleEmployee, toggleSource, setPage, setDate, setSearch, clearFilter } from "@/hooks/useLeadsSearchParams";
import { useUser } from "@/context/UserContext";
import { FetchLeads } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Calendar } from "@/shared/components/ui/calendar";
import { Building2, Mail, Phone, User, ChevronLeft, ChevronsLeftIcon, ChevronsRightIcon, ChevronRight, Search, ChevronsUpDown, CalendarIcon, X } from "lucide-react";
import { FetchSalesEmployee } from "@/api/employees/employee.queries";
import { FetchSources } from "@/api/sources/source.queries";
import LeadTableLoader from "./loaders/LeadTableLoader";

const LeadsTable = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const search: string = searchParams.get("search") || "";
	const page: number = parseInt(searchParams.get("page") || "1", 10);
	const rows: number = parseInt(searchParams.get("rows") || "25", 10);
	const startDate: string = searchParams.get("startDate") || "";
	const endDate: string = searchParams.get("endDate") || "";
	const rawEmployeeIDs = searchParams.get("employeeID") || "";
	const rawSources = searchParams.get("sources") || "";
	let employeeIDs: string[] = useMemo(() => rawEmployeeIDs.split(",").filter(Boolean), [rawEmployeeIDs]);
	let selectedSources: string[] = useMemo(() => rawSources.split(",").filter(Boolean), [rawSources]);

	const [datePopoverOpen, setDatePopoverOpen] = useState(false);
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebounce(searchInput, 500);

	const { data: employeeData, isError: employeeError, isPending: employeePending } = FetchSalesEmployee();
	const { data: leadsData, isPending: leadsPending, isError: leadsError } = FetchLeads({ page, search, employeeIDs, rows, startDate, endDate, selectedSources });
	const { data: sourceData, isError: sourceError, isPending: sourcePending } = FetchSources();

	const lastPage = Math.ceil((leadsData?.totalLeads || 0) / rows) == 0 ? 1 : Math.ceil((leadsData?.totalLeads || 0) / rows);

	const navigate = useNavigate();
	const { user } = useUser();

	useEffect(() => {
		setSearch(debouncedSearch, search, setSearchParams, rows);
	}, [debouncedSearch, search, setSearchParams]);

	const handleRowChange = (value: string) => {
		setSearchParams((params) => {
			params.set("rows", value);
			params.set("page", "1");
			return params;
		});
	};

	if (leadsPending || employeePending || sourcePending) return <LeadTableLoader />;

	if (leadsError || employeeError || sourceError) {
		return <>Error while loading page</>;
	}

	return (
		<Card className="mb-6 bg-background">
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 relative w-full md:w-[270px]">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-foreground h-4 w-4" />
						<Input
							placeholder="Search leads by name or company"
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
							}}
							className="pl-10 text-accent-foreground"
						/>
					</div>
					{user?.department === DEPARTMENTS[1] ? (
						<div>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="flex justify-between w-full">
										Filter by employees
										<ChevronsUpDown></ChevronsUpDown>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-64 p-0">
									<Command>
										<CommandInput placeholder="Search employees..." />
										<CommandList>
											<CommandEmpty>No employees found.</CommandEmpty>
											<CommandGroup>
												{employeeData.employees.map((employee: GetEmployeeOutput) => (
													<CommandItem key={employee.id}>
														<Checkbox className="mr-2" checked={employeeIDs.includes(String(employee.id))} onCheckedChange={() => toggleEmployee(String(employee.id), setSearchParams, employeeIDs, rows)} />
														{employee.first_name} {employee.last_name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
					) : (
						<></>
					)}
					<div>
						<Select onValueChange={handleRowChange} value={String(rows)}>
							<SelectTrigger className="w-full md:w-18">
								<SelectValue placeholder="Select number of rows" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Rows</SelectLabel>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="25">25</SelectItem>
									<SelectItem value="50">50</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Button
							variant="ghost"
							onClick={() => {
								selectedSources = [];
								employeeIDs = [];
								setSearchInput("");
								clearFilter(setSearchParams);
							}}
						>
							<X className="h-4 w-4" /> Clear filter
						</Button>
					</div>
				</div>
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
																<Checkbox className="mr-2" checked={selectedSources.includes(String(source.id))} onCheckedChange={() => toggleSource(String(source.id), setSearchParams, selectedSources, rows)} />
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
													<Calendar mode="single" selected={startDate ? new Date(startDate) : undefined} onSelect={(date) => setDate(date, "start", setSearchParams, rows)} disabled={(date) => date > new Date()} />
												</div>
												<div>
													<div className="text-xs font-medium mb-1">End Date</div>
													<Calendar mode="single" selected={endDate ? new Date(endDate) : undefined} onSelect={(date) => setDate(date, "end", setSearchParams, rows)} disabled={(date) => date > new Date()} />
												</div>
											</div>
											{(startDate || endDate) && (
												<Button variant="outline" size="sm" className="mt-2" onClick={() => setDate(undefined, "clear", setSearchParams, rows)}>
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
											{lead.client_detail.first_name} {lead.client_detail.last_name}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center">
											<Building2 className="h-4 w-4 mr-2 " />
											{lead.company.name}
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
				<div className="flex gap-2 mt-4 lg:ml-0">
					<Button variant="outline" className="h-8 w-8 p-0 lg:flex" onClick={() => setPage(1, setSearchParams, rows)} disabled={page == 1}>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeftIcon />
					</Button>
					<Button variant="outline" className="size-8" size="icon" onClick={() => setPage(page - 1, setSearchParams, rows)} disabled={page == 1}>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<span className="mx-2">
						{" "}
						Page {page} of {lastPage}{" "}
					</span>
					<Button variant="outline" className="size-8" size="icon" onClick={() => setPage(page + 1, setSearchParams, rows)} disabled={page == lastPage}>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button variant="outline" className=" size-8 lg:flex" size="icon" onClick={() => setPage(lastPage, setSearchParams, rows)} disabled={page == lastPage}>
						<span className="sr-only">Go to last page</span>
						<ChevronsRightIcon />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};

export default LeadsTable;
