import { FetchLeadByDuration } from "@/api/leads/leads.queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { TargetIcon } from "lucide-react";
import { useState } from "react";
import DivLoader from "@/shared/components/loaders/DivLoader";
import ErrorDisplay from "@/shared/components/ErrorPage";

const LeadAnalytics = () => {
	const [period, setPeriod] = useState<"today" | "weekly" | "monthly" | "yearly" | "all">("today");

	const { data, isPending, isError } = FetchLeadByDuration(period);

	if (isPending) return <DivLoader height={48} showHeading={false}/>;
	if(isError) return <ErrorDisplay message="Failed to load data. Refresh or please try again later" />

	return (
		<Card className="mb-4 bg-background">
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="space-y-2">
						<div className="flex gap-4 items-center">
							<div className="flex items-center space-x-2">
								<TargetIcon className="h-5 w-5" />
								<CardTitle className="text-lg">Leads Analytics</CardTitle>
							</div>
							<Select value={period} onValueChange={(val) => setPeriod(val as typeof period)}>
								<SelectTrigger className="">
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="today">Today</SelectItem>
									<SelectItem value="weekly">Weekly</SelectItem>
									<SelectItem value="monthly">Monthly</SelectItem>
									<SelectItem value="yearly">Yearly</SelectItem>
									<SelectItem value="all">All Time</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<CardDescription>Lead generation performance for</CardDescription>
					</div>
					<CardContent className="space-y-4">
						<div className="text-xl font-bold">
							Total Leads: <span className="text-primary">{data?.totalLeads}</span>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{Object.entries(data?.employeeLeadCount || 0).map(([name, count]: [string, number], index: number) => {
								const colors = ["bg-chart-1/10 text-chart-1", "bg-chart-2/10 text-chart-2", "bg-chart-3/10 text-chart-3", "bg-chart-4/10 text-chart-4", "bg-chart-5/10 text-chart-5"];
								const color = colors[index % colors.length];
								const total = data?.totalLeads ?? 0;
								const percent = ((count / total) * 100).toFixed(0);
								return (
									<div key={name} className={`rounded-xl p-4 ${color} flex flex-col justify-between shadow-sm`}>
										<div className="flex justify-between items-center">
											<div className="text-lg font-semibold truncate">{name}</div>
											<div className={`rounded-full px-2 py-1 text-sm font-bold bg-white ${color}`}>{count}</div>
										</div>
										<div className="mt-3 flex items-center gap-2">
											<div className={`h-3 w-3 rounded-full ${color}`}></div>
											<div className="text-sm font-medium text-muted-foreground">{percent}% of total</div>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</div>
			</CardHeader>
		</Card>
	);
};

export default LeadAnalytics;
