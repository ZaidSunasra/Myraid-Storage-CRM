import { useAddDescription, useDeleteDescription } from "@/api/leads/leads.mutation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDescriptionSchema, type AddDescription, type GetDescriptionOutput, type GetEmployeeOutput } from "zs-crm-common";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Notebook, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { FetchDescription } from "@/api/leads/leads.queries";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import EditDescription from "./EditDescription";
import { Mention, MentionsInput } from "react-mentions";
import { FetchAllEmployee } from "@/api/employees/employee.queries";
import { mentionStyle } from "@/utils/customStyle";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { format } from "date-fns";

const LeadDescription = ({ id }: { id: string }) => {
	const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [data, setData] = useState<null | number | GetDescriptionOutput>(null);

	const { data: descriptionData, isPending: descriptionPending, isError: descriptionError } = FetchDescription(id);
	const { data: allEmployeeData, isPending: allEmployeePending, isError: allEmployeeError } = FetchAllEmployee();
	const addDescription = useAddDescription();
	const deleteDescription = useDeleteDescription();

	const allEmployeeArray = useMemo(() => {
		if (!allEmployeePending && allEmployeeData) {
			return allEmployeeData.employees.map((emp: GetEmployeeOutput) => ({ id: emp.id, display: `${emp.first_name} ${emp.last_name}` }));
		}
		return [];
	}, [allEmployeeData, allEmployeePending]);

	const form = useForm<AddDescription>({ resolver: zodResolver(addDescriptionSchema), defaultValues: { description: "" } });

	const onPostSubmit = (formData: AddDescription) => {
		addDescription.mutate({ data: formData, id });
		form.reset();
	};

	const onDeleteSubmit = () => {
		deleteDescription.mutate(String(data));
		setData(null);
		setOpen(false);
		setActionType(null);
	};

	if (descriptionPending || allEmployeePending) return <Skeleton className="bg-background w-full h-66" />;
	if (descriptionError || allEmployeeError) return <>Error..</>;

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onPostSubmit)} className="w-full space-y-4">
					<Card className="bg-background">
						<CardHeader>
							<CardTitle>Description & Notes</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label> Previous Description </Label>
								<div className="flex items-center space-x-2">
									<div className="flex flex-col space-y-1 w-full">
										{descriptionData.descriptions.map((description: GetDescriptionOutput) => (
											<div key={description.id} className="flex flex-col sm:flex-row items-start justify-between bg-muted p-4 rounded-lg shadow-sm hover:bg-muted/80 transition">
												<div className="flex items-start gap-3 mb-2 sm:mb-0">
													<Notebook className="h-6 w-6 mt-1 text-primary" />
													<div>
														<div className="text-sm text-accent-foreground whitespace-pre-line break-words">{description.notes.replace(/(@\[[^\]]+\])\s\(\d+\)/g, "$1")}</div>
														<div className="text-xs text-muted-foreground mt-1">
															Last Updated by {description.user.first_name} {description.user.last_name} on {format(description.updated_at as Date, "dd/mm/yyyy hh:mm a")}
														</div>
													</div>
												</div>
												<div className="flex gap-2 justify-end w-full sm:w-0">
													<Button
														type="button"
														onClick={() => {
															(setData(description), setOpen(true), setActionType("edit"));
														}}
														className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
													>
														<Pencil className="w-5 h-5" />
													</Button>
													<Button
														type="button"
														onClick={() => {
															(setData(description.id), setOpen(true), setActionType("delete"));
														}}
														className="p-2 rounded-md bg-destructive hover:bg-destructive/90 text-white transition"
													>
														<Trash2 className="w-5 h-5" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<MentionsInput value={field.value} onChange={(e) => field.onChange(e.target.value)} style={mentionStyle}>
													<Mention trigger="@" data={allEmployeeArray} displayTransform={(_id, display) => `@${display}`} markup="@[__display__] (__id__)" appendSpaceOnAdd style={{ backgroundColor: "#cee4e5" }} />
												</MentionsInput>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type="submit">Add Description</Button>
						</CardContent>
					</Card>
				</form>
			</Form>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					{actionType == "edit" ? (
						<>
							<DialogHeader>
								<DialogTitle> Edit Description </DialogTitle>
								<DialogDescription>Update the details of the description.</DialogDescription>
							</DialogHeader>
							<EditDescription data={data as GetDescriptionOutput} setOpen={setOpen} employee={allEmployeeArray} />
						</>
					) : actionType == "delete" ? (
						<>
							<DialogHeader>
								<DialogTitle> Delete Description </DialogTitle>
								<DialogDescription>Are you sure you want to delete this description entry? This action cannot be undone.</DialogDescription>
							</DialogHeader>
							<DialogFooter className="sm:justify-start">
								<Button
									type="submit"
									className="px-3 flex gap-1 items-center"
									variant="destructive"
									onClick={() => {
										onDeleteSubmit();
									}}
								>
									<span> Delete </span>
									<Trash2 />
								</Button>
							</DialogFooter>
						</>
					) : (
						<></>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default LeadDescription;
