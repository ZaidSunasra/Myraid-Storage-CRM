import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";
import { DEPARTMENTS, type LeadByDay, type ReminderMonth } from "zs-crm-common";

const DailyData = ({ leadsData, meetingData }: { leadsData: Record<string, LeadByDay[]>; meetingData: ReminderMonth[] }) => {
	const navigate = useNavigate();
	const { user } = useUser();

	return (
		<div className="overflow-y-auto">
			{meetingData &&
				meetingData.length > 0 &&
				meetingData.map((meeting: ReminderMonth) => (
					<div className="space-y-1 p-2" key={meeting.lead_id}>
						<div className="bg-blue-500 p-3 rounded text-white text-sm shadow hover:bg-blue-600 transition duration-200 cursor-pointer" onClick={() => navigate(`/lead/${meeting.lead_id}?tab=scheduling`)} title={meeting.title}>
							{meeting.title} - {meeting.client_name} from {meeting.company_name}
						</div>
					</div>
				))}
			{user?.department === DEPARTMENTS[1] &&
				leadsData &&
				Object.keys(leadsData).length > 0 &&
				Object.entries(leadsData).map(([employeeName, leads]: [string, LeadByDay[]]) => (
					<div key={employeeName} className="space-y-1 p-2">
						<h2 className="text-lg font-semibold text-primary">{employeeName}</h2>
						<h4 className="font-normal ">Leads</h4>
						<div className="space-y-1">
							{leads.map((lead: LeadByDay) => (
								<div key={lead.id} className="p-2 rounded-lg bg-muted shadow-sm hover:bg-muted/80 transition cursor-pointer" onClick={() => navigate(`/lead/${lead.id}`)}>
									<div className="font-medium text-accent-foreground">
										{lead.client_detail.first_name} {lead.client_detail.last_name}
									</div>
									<div className="text-sm text-muted-foreground">Company: {lead.company.name}</div>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
};

export default DailyData;
