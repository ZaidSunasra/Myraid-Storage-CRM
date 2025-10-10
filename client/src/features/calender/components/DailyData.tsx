import { usePermissions } from "@/context/PermissionContext";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { useNavigate } from "react-router";
import { type GroupedRecords, type ReminderMonth } from "zs-crm-common";

const DailyData = ({ data, meetingData }: { data: Record<string, GroupedRecords>; meetingData: ReminderMonth[] }) => {
	const navigate = useNavigate();
	const { user } = useUser();
	const {canView} = usePermissions();

	return (
		<div className="overflow-y-auto">
			{meetingData && meetingData.length > 0 && (
				<div className="space-y-2">
					{meetingData.map((meeting: ReminderMonth) => {
						const link = meeting.deal_id
							? `/deal/${meeting.deal_id}?tab=scheduling`
							: `/lead/${meeting.lead_id}?tab=scheduling`
						return (
							<div
								key={meeting.lead_id}
								onClick={() => navigate(link)}
								className="p-3 rounded-lg bg-accent shadow-sm hover:bg-blue-500 transition cursor-pointer"
							>
								<div className="font-medium">{capitalize(meeting.title)}</div>
								<div className="text-sm text-primary">
									<div>Company: {toTitleCase(meeting.company_name)} </div>
									<div>Client: {toTitleCase(meeting.client_name)}  </div>
								</div>
							</div>
						)
					})}
				</div>
			)}

			{user?.department && canView(user.department, "daily_calendar_data") &&
				data && Object.keys(data).length > 0 && (
					Object.entries(data ?? {}).map(([employeeName, records]) => (
						<Card key={employeeName} className="m-2">
							<CardHeader className="text-lg font-semibold text-primary">
								<CardTitle>{employeeName}</CardTitle>
							</CardHeader>
							<CardContent>
								<h4 className="font-medium">Leads</h4>
								<div className="space-y-1">
									{records.leads.length > 0 ? (
										records.leads.map((lead) => (
											<div
												key={lead.lead_id}
												className="p-2 rounded-lg bg-muted shadow-sm hover:bg-muted/80 transition cursor-pointer"
												onClick={() => navigate(`/lead/${lead.lead_id}`)}
											>
												<div className="font-medium text-accent-foreground">
													{capitalize(lead.client_name)}
												</div>
												<div className="text-sm text-muted-foreground">
													Company: {toTitleCase(lead.company_name)}
												</div>
												{lead.deal_id && (
													<div className="text-xs text-muted-foreground">
														Linked Deal: {lead.deal_id}
													</div>
												)}
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No leads</p>
									)}
								</div>
							</CardContent>
							<CardContent>
								<h4 className="font-medium">Deals</h4>
								<div className="space-y-1">
									{records.deals.length > 0 ? (
										records.deals.map((deal) => (
											<div
												key={deal.deal_id}
												className="p-2 rounded-lg bg-muted shadow-sm hover:bg-muted/80 transition cursor-pointer"
												onClick={() => navigate(`/deal/${deal.deal_id}`)}
											>
												<div className="font-medium text-accent-foreground">
													{capitalize(deal.client_name)}
												</div>
												<div className="text-sm text-muted-foreground">
													Company: {toTitleCase(deal.company_name)}
												</div>
												<div className="text-xs text-muted-foreground">
													Deal ID: {deal.deal_id}
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-muted-foreground">No deals</p>
									)}
								</div>
							</CardContent>
						</Card>
					))
				)
			}
		</div>
	)
}
export default DailyData
