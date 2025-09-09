import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calculator, Check, FileText, Package } from "lucide-react";

const steps = [
	{
		id: 1,
		title: "Products & Info",
		description: "Add products and basic info",
		icon: Package,
	},
	{
		id: 2,
		title: "Costing",
		description: "Calculate costs",
		icon: Calculator,
	},
	{
		id: 3,
		title: "Finalization",
		description: "Calculate grand total and confirm quotation",
		icon: FileText,
	},
];

const QuotationSideBar = ({ currentStep }: { currentStep: number }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm">Quotation Progress</CardTitle>
				<CardDescription className="text-xs">
					Follow the steps to prepare and finalize the quotation
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-6">
					{steps.map((step) => {
						const Icon = step.icon;
						return (
							<div key={step.id} className="flex items-center space-x-3">
								<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= step.id
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
									}`}
								>
									{currentStep > step.id ? (
										<Check className="h-4 w-4" />
									) : (
										<Icon className="h-4 w-4" />
									)}
								</div>
								<div className="flex flex-col">
									<span className={`font-medium text-sm ${currentStep >= step.id
										? "text-foreground"
										: "text-muted-foreground"
										}`}
									>
										{step.title}
									</span>
									<span className="text-xs text-muted-foreground">
										{step.description}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

export default QuotationSideBar;
