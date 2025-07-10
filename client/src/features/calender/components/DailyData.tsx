import { useNavigate } from "react-router";

const DailyData = ({ leadsData, meetingData }: { leadsData: any, meetingData: any }) => {
    const navigate = useNavigate();

    return <>
        {meetingData && meetingData.length > 0 && meetingData.map(
            (meeting: any) => (
                <div className="p-2" key={meeting.lead_id}>
                    <div
                        className="bg-blue-500 p-3 rounded text-white text-sm shadow hover:bg-blue-600 transition duration-200 cursor-pointer"
                        onClick={() => navigate(`/lead/${meeting.lead_id}?tab=scheduling`)}
                        title={meeting.title}
                    >
                        {meeting.title.length > 20
                            ? meeting.title.slice(0, 20) + "..."
                            : meeting.title} - {meeting.client_name} from {meeting.company_name}
                    </div>
                </div>
            )
        )}
        {leadsData && Object.keys(leadsData).length > 0 && (
            Object.entries(leadsData).map(([employeeName, leads]: any) => (
                <div key={employeeName} className="space-y-2  p-2">
                    <h2 className="text-lg font-semibold text-primary">{employeeName}</h2>
                    <h4 className="font-normal ">Leads</h4>
                    <div className="space-y-2">
                        {leads.map((lead: any) => (
                            <div key={lead.id} className="p-4 rounded-lg bg-muted shadow-sm hover:bg-muted/80 transition cursor-pointer" onClick={() => navigate(`/lead/${lead.id}`)}>
                                <div className="font-medium text-accent-foreground">
                                    {lead.client_detail.first_name} {lead.client_detail.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Company: {lead.company.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}

    </>

}

export default DailyData;