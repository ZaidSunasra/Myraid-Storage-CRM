import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { capitalize } from "@/utils/formatData";
import { Check } from "lucide-react";

const FormSideBar = ({ currentStep, type }: { currentStep: number, type : "lead" | "deal"}) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm">Progress</CardTitle>
				<CardDescription className="text-xs">Complete all steps to update the {type}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-3">
					<div className="flex items-center space-x-3">
						<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
							{currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
						</div>
						<div className="flex-1">
							<div className={`font-medium text-sm ${currentStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Company Details</div>
							<div className="text-xs text-muted-foreground">Basic company information</div>
						</div>
					</div>
					<div className="ml-4 w-px h-6 bg-border"></div>
					<div className="flex items-center space-x-3">
						<div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
							{currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
						</div>
						<div className="flex-1">
							<div className={`font-medium text-sm ${currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>{capitalize(type)} Details</div>
							<div className="text-xs text-muted-foreground">Contact and product information</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default FormSideBar;
