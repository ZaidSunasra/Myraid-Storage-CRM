import LeadsTable from "../components/LeadsTable";
import { Button } from "@/shared/components/ui/button";
import Navbar from "@/shared/components/Navbar";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import LeadAnalytics from "../components/LeadAnalytics";
import { useUser } from "@/context/UserContext";
import { usePermissions } from "@/context/PermissionContext";

const LeadsPage = () => {
	const navigate = useNavigate();
	const { user } = useUser();
	const { canView } = usePermissions()

	return (
		<div className="bg-accent min-h-screen">
			<Navbar />
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="flex flex-col p-2 sm:p-0 sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
					<div>
						<h1 className="text-2xl font-bold text-primary">Leads</h1>
						<p className="text-muted-foreground">Manage and track your sales leads</p>
					</div>
					{user?.department && canView(user?.department, "add_lead") &&
						<Button onClick={() => navigate("/lead/add")}>
							<Plus className="h-4 w-4 mr-2" />
							Add Lead
						</Button>
					}
				</div>
				{user?.department && canView(user?.department, "view_lead_analytics") &&
					<LeadAnalytics />
				}
				<LeadsTable />
			</div>
		</div>
	);
};

export default LeadsPage;
