import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { format } from "date-fns";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import type { Assignee, GetLeadOutput } from "zs-crm-common";

const LeadDetails = ({ data }: { data: GetLeadOutput }) => {
	return (
		<>
			<Card className="bg-background">
				<CardHeader>
					<CardTitle>Contact Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Full Name</Label>
							<div className="flex items-center space-x-2">
								<User className="h-4 w-4 text-gray-400" />
								<span>
									{" "}
									{capitalize(data.client_detail.first_name)} {capitalize(data.client_detail.last_name)}
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label>GST No.</Label>
							<span>{data.company.gst_no == "" ? "No GST provided" : data.company.gst_no?.toUpperCase()} </span>
						</div>
						<div className="space-y-2">
							<Label>Company</Label>
							<div className="flex items-center space-x-2">
								<Building2 className="h-4 w-4 text-gray-400" />
								<span>{toTitleCase(data.company.name)}</span>
							</div>
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<div className="flex flex-col space-y-2">
								{data.client_detail.emails.length === 0
									? "No email provided"
									: data.client_detail.emails.map((e) =>
										e.email ? (
											<div key={e.email} className="flex items-center gap-x-2">
												<Mail className="h-4 w-4 text-gray-400" />
												<span>{e.email}</span>
											</div>
										) : null
									)}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Phone</Label>
							<div className="flex flex-col space-y-2">
								{data.client_detail.phones.length == 0
									? "No phone provided"
									: data.client_detail.phones.map((p: { phone: string }) => (
										<div key={p.phone} className="flex items-center gap-x-2">
											<Phone className="h-4 w-4 text-gray-400" />
											<span>{p.phone}</span>
										</div>
									))}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Address</Label>
							<div className="flex items-center space-x-2">
								<MapPin className="h-4 w-4 text-gray-400" />
								<span>{toTitleCase(data.company.address)}</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card className="bg-background">
				<CardHeader>
					<CardTitle>Lead Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Source</Label>
							<span>{data.source.name.replace("_", " ").replace(/\b\w/g, (char: string) => char.toUpperCase())}</span>
						</div>
						<div className="space-y-2">
							<Label>Assigned To</Label>
							<div className="space-y-1">
								{data.assigned_to.map((assignee: Assignee, idx: number) => (
									<div key={assignee.user.id ?? idx} className="flex items-center">
										<User className="h-4 w-4 text-gray-400 mr-2" />
										<span>
											{assignee.user.first_name} {assignee.user.last_name}
										</span>
									</div>
								))}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Created Date</Label>
							<span>{format(data.created_at, "dd/MM/yyyy hh:mm a")}</span>
						</div>
						<div className="space-y-2">
							<Label>Product</Label>
							<span> {data.product.name.replace(/\b\w/g, (char: string) => char.toUpperCase())}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default LeadDetails;
