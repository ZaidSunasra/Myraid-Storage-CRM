import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign, TrendingUp, User } from "lucide-react";

const LeadSideBar = () => {
	const companyDeals = [
		{ id: "1", title: "Enterprise License Renewal", value: "$45,000", status: "Closed Won", date: "2023-12-15", contact: "Sarah Wilson" },
		{ id: "2", title: "Additional User Licenses", value: "$12,000", status: "Closed Won", date: "2023-08-22", contact: "Mike Johnson" },
		{ id: "3", title: "Consulting Services", value: "$8,500", status: "Closed Won", date: "2023-06-10", contact: "Alex Thompson" }
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<TrendingUp className="h-5 w-5" />
					<span>Company History</span>
				</CardTitle>
				<CardDescription>Stargate - Previous Deals</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{companyDeals.map((deal) => (
						<div key={deal.id} className="border-l-4 border-blue-500 pl-4 py-2">
							<div className="flex items-center justify-between mb-1">
								<h4 className="font-medium text-sm">{deal.title}</h4>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<div className="flex items-center justify-between">
									<span className="flex items-center">
										<DollarSign className="h-3 w-3 mr-1" />
										{deal.value}
									</span>
									<span>{deal.date}</span>
								</div>
								<div className="flex items-center">
									<User className="h-3 w-3 mr-1" />
									{deal.contact}
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="mt-4 pt-4 border-t">
					<div className="text-sm text-gray-600">
						<div className="flex justify-between">
							<span>Total Deals:</span>
							<span className="font-medium">{companyDeals.length}</span>
						</div>
						<div className="flex justify-between">
							<span>Total Value:</span>
							<span className="font-medium">$65,500</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default LeadSideBar;
