import { NavLink, useNavigate, useParams, useSearchParams } from "react-router";
import LeadDetails from "../components/LeadDetails";
import LeadScheduling from "@/shared/components/MeetScheduling";
import { FetchLeadById } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, ArrowRightLeft, Edit } from "lucide-react";
import Description from "@/shared/components/Description";
import Navbar from "@/shared/components/Navbar";
import { type GetEmployeeOutput, type GetLeadOutput } from "zs-crm-common";
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { useConvertToDeal } from "@/api/deals/deal.mutation";
import { FetchAssignedEmployee } from "@/api/employees/employee.queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useRef } from "react";
import ScheduledMeeting from "@/shared/components/ScheduledMeeting";
import { useUser } from "@/context/UserContext";
import ErrorDisplay from "@/shared/components/ErrorPage";
import { toast } from "sonner";
import { usePermissions } from "@/context/PermissionContext";

const DetailedLeadPage = () => {

	const [searchParams] = useSearchParams();
	const tab = searchParams.get("tab") || "info";
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useUser();
	const { canView } = usePermissions()
	const { data, isPending, isError } = FetchLeadById(id as string);
	const { data: assignedEmployeeData, isPending: assignedEmployeePending, isError: assignedEmployeeError } = FetchAssignedEmployee(id as string, "lead");

	const quotationCode = useRef<string>(user?.code);

	const convertLead = useConvertToDeal();
	const handleLeadConversion = () => {
		if (!quotationCode.current) {
			toast.error("User do not have a quotation code");
			return;
		};
		convertLead.mutate({ id: id as string, quotation_code: quotationCode.current, })
	}

	if (isPending || assignedEmployeePending) return <DetailedPageLoader />;

	if (isError || assignedEmployeeError) return <ErrorDisplay fullPage />

	return (
		<div className="min-h-screen bg-accent">
			<Navbar />
			<div className="mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-0 py-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 p-2 sm:p-0 gap-4">
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
						{user?.department && canView(user.department, "add_lead") &&
							<Button onClick={() => navigate(`/lead/edit/${id}`)}>
								<Edit className="h-4 w-4 mr-2" />
								Edit Lead
							</Button>
						}
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
								{user?.department && canView(user.department, "add_description") &&
									<Description id={String(data.lead?.id)} type="lead" />
								}
							</TabsContent>
							<TabsContent value="scheduling" className="space-y-6">
								{user?.department && canView(user.department, "schedule_meeting") && <LeadScheduling type="lead" id={id as string} />}
								<ScheduledMeeting id={id as string} type="lead" />
							</TabsContent>
						</Tabs>
					</div>
					<div className="lg:col-span-1">
						<div className="w-full">
							{!data.lead?.is_converted && <Dialog>
								<DialogTrigger asChild>
									<Button className="mb-8 text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full bg-emerald-600 hover:bg-emerald-700">
										<ArrowRightLeft className="w-4 h-4" />
										Convert to Deal
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Convert the lead to deal</DialogTitle>
										<DialogDescription>Are you sure you want to convert the lead? This cannot be undone.</DialogDescription>
									</DialogHeader>
									{user?.department && canView(user?.department, "select_quotation_code") &&
										<Select onValueChange={(value) => (quotationCode.current = value)}>
											<SelectTrigger >
												<SelectValue placeholder="Select quotation code" />
											</SelectTrigger>
											<SelectContent>
												{assignedEmployeeData.employees.map((employee: GetEmployeeOutput) => (
													<SelectItem value={employee.quotation_code as string} key={employee.id}>
														{employee.first_name} {employee.last_name} ({employee.quotation_code})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									}
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline">Cancel</Button>
										</DialogClose>
										<Button type="submit" onClick={handleLeadConversion}>
											Convert
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>}
						</div>
						{/* <LeadSideBar /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailedLeadPage;
