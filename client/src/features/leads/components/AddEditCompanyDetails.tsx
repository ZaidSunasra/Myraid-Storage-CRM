import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Building2, ChevronRight } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { AddLead } from "zs-crm-common";

const AddEditCompanyDetails = ({ form, handleClick }: { form: UseFormReturn<AddLead>; handleClick: () => void }) => {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Building2 className="h-5 w-5" />
						<span>Company Details</span>
					</CardTitle>
					<CardDescription>Enter the company information for this lead</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="company_name"
								render={({ field }) => (
									<FormItem>
										<div className="space-y-2">
											<FormLabel>Company Name*</FormLabel>
											<FormControl>
												<Input id="company_name" placeholder="Enter company name" {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="gst_no"
								render={({ field }) => (
									<FormItem>
										<div className="space-y-2">
											<FormLabel>GST No</FormLabel>
											<FormControl>
												<Input id="gst_no" placeholder="Enter GST No" {...field} />
											</FormControl>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-2">
										<FormLabel>Company Address*</FormLabel>
										<FormControl>
											<Textarea id="address" placeholder="Enter complete company address" rows={3} {...field} />
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
					</div>
					<div className="flex justify-end">
						<Button onClick={handleClick}>
							Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default AddEditCompanyDetails;

// disabled={!isStep1Valid}
// const {watch} = form;
// const isStep1Valid = watch("company_name")?.trim() && watch("address")?.trim();
