import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";
import LeadDetails from "../components/LeadDetails";
import LeadScheduling from "../components/LeadScheduling";
import { FetchLeadById } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, ArrowRightLeft, Edit } from "lucide-react";
import LeadDescription from "../components/LeadDescription";
import LeadSideBar from "../components/LeadSidebar";
import Navbar from "@/shared/components/Navbar";
import type { GetEmployeeOutput, GetLeadOutput } from "zs-crm-common";
import DetailedLeadPageLoader from "../components/loaders/DetailedLeadPageLoader";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { useConvertToDeal } from "@/api/deals/deal.mutation";
import { FetchAssignedEmployee } from "@/api/employees/employee.queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useRef } from "react";

const DetailedLeadPage = () => {

	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab") || "info";
	const navigate = useNavigate();
	const { id } = useParams();
	const { data, isPending, isError } = FetchLeadById(id || "");
	const { data: assignedEmployeeData, isPending: assignedEmployeePending, isError: assignedEmployeeError } = FetchAssignedEmployee(id as string);

	const quotationCode = useRef<string | null>(null);

	const convertLead = useConvertToDeal();
	const handleLeadConversion = () => {
		if (!quotationCode.current) return;
		convertLead.mutate({ id: id as string, quotation_code: quotationCode.current, })
	}

	if (isPending || assignedEmployeePending) return <DetailedLeadPageLoader />;

	if (isError || assignedEmployeeError) {
		return <div>Error</div>;
	}

	return (
		<div className="min-h-screen bg-accent">
			<Navbar />
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-0 py-6">
					<div className="flex items-center justify-between mb-6 ">
						<div className="flex items-center">
							<NavLink to="/lead">
								<Button variant="ghost" size="icon">
									<ArrowLeft className="h-4 w-4" />
								</Button>
							</NavLink>
							<div>
								<h1 className="text-2xl font-bold ">
									{capitalize(data.lead?.client_detail.first_name as string)} {capitalize(data.lead?.client_detail.last_name as string)}
								</h1>
								<p className="text-gray-600">{toTitleCase(data.lead?.company.name as string)}</p>
							</div>
						</div>
						<Button onClick={() => navigate(`/lead/edit/${id}`)}>
							<Edit className="h-4 w-4 mr-2" />
							Edit Lead
						</Button>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3">
						<Tabs defaultValue={tab} className="space-y-6">
							<TabsList className="grid w-full grid-cols-2 bg-background">
								<TabsTrigger value="info">Lead Information</TabsTrigger>
								<TabsTrigger value="scheduling">Scheduling</TabsTrigger>
							</TabsList>
							<TabsContent value="info" className="space-y-6">
								<LeadDetails data={data.lead as GetLeadOutput} />
								<LeadDescription id={String(data.lead?.id)} />
							</TabsContent>
							<TabsContent value="scheduling" className="space-y-6">
								<LeadScheduling />
							</TabsContent>
						</Tabs>
					</div>
					<div className="lg:col-span-1">
						<div className="w-full mb-8">
							<Dialog>
								<DialogTrigger asChild>
									<Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full bg-emerald-600 hover:bg-emerald-700">
										<ArrowRightLeft className="w-4 h-4" />
										Convert to Deal
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Convert the lead to deal</DialogTitle>
										<DialogDescription>Are you sure you want to convert the lead? This cannot be undone.</DialogDescription>
									</DialogHeader>
									<Select onValueChange={(value) => (quotationCode.current = value)}>
										<SelectTrigger >
											<SelectValue placeholder="Select quotation code" />
										</SelectTrigger>
										<SelectContent>
											{assignedEmployeeData.employees.map((employee: GetEmployeeOutput) => (
												<SelectItem value={employee.quotation_code as string}>
													{employee.first_name} {employee.last_name} ({employee.quotation_code})
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<Button type="submit" onClick={handleLeadConversion}>
											Convert
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
						<LeadSideBar />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailedLeadPage;
