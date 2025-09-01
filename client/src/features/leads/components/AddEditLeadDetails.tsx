import { FetchSalesEmployee } from "@/api/employees/employee.queries";
import { FetchProducts } from "@/api/products/product.queries";
import { FetchSources } from "@/api/sources/source.queries";
import { useUser } from "@/context/UserContext";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ArrowLeft, Plus, Trash, User } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { DEPARTMENTS, type AddLead, type GetEmployeeOutput, type GetProductOutput, type GetSourceOutput } from "zs-crm-common";
import { capitalize, toTitleCase } from "@/utils/formatData";
import MangeSourceOrProduct from "@/shared/components/ManageSourceOrProduct";
import ErrorDisplay from "@/shared/components/ErrorPage";

const AddEditLeadDetails = ({ form, handleClick, isLoading }: { form: UseFormReturn<AddLead>; handleClick: () => void; isLoading?: boolean }) => {
	const { data: employeeData, isError: employeeError, isPending: employeePending } = FetchSalesEmployee();
	const { data: sourceData, isError: sourceError, isPending: sourcePending } = FetchSources();
	const { data: productData, isError: productError, isPending: productPending } = FetchProducts();

	const { user } = useUser();

	const { fields: phoneField, append: phoneAppend, remove: phoneRemove } = useFieldArray({ control: form.control, name: "phones" });

	const { fields: emailFields, append: emailAppend, remove: emailRemove } = useFieldArray({ control: form.control, name: "emails" });

	const { fields: assignField, append: assignAppend, remove: assignRemove } = useFieldArray({ control: form.control, name: "assigned_to" });

	if (employeeError || sourceError || productError) return <ErrorDisplay /> ;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<User className="h-5 w-5" />
					<span>Lead Details</span>
				</CardTitle>
				<CardDescription>Enter the contact person and product information</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="first_name"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-2">
										<FormLabel>First Name*</FormLabel>
										<FormControl>
											<Input id="first_name" placeholder="Enter first name" {...field} />
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
							name="last_name"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-2">
										<FormLabel>Last Name*</FormLabel>
										<FormControl>
											<Input id="last_name" placeholder="Enter last name" {...field} />
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-2">
						<FormLabel className="mb-2">Email</FormLabel>
						{emailFields.map((field, index) => (
							<FormField
								key={field.id}
								control={form.control}
								name={`emails.${index}.email`}
								render={({ field }) => (
									<FormItem className="">
										<div className="flex items-center gap-2">
											<FormControl>
												<Input {...field} placeholder="Enter email" />
											</FormControl>
											<Button type="button" variant="destructive" onClick={() => emailRemove(index)}>
												<Trash />
											</Button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<Button type="button" onClick={() => emailAppend({ email: "" })} variant="outline">
							<Plus />
							Add Email
						</Button>
					</div>
					<div className="space-y-2">
						<FormLabel className="mb-2">Phone Number*</FormLabel>
						{phoneField.map((field, index) => (
							<FormField
								key={field.id}
								control={form.control}
								name={`phones.${index}.number`}
								render={({ field }) => (
									<FormItem className="">
										<div className="flex items-center gap-2">
											<FormControl>
												<Input {...field} placeholder="Enter phone number" type="tel" />
											</FormControl>
											<Button type="button" variant="destructive" onClick={() => phoneRemove(index)}>
												<Trash />
											</Button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<Button type="button" onClick={() => phoneAppend({ number: "" })} variant="outline">
							<Plus /> Add Phone
						</Button>
					</div>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="source_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source*</FormLabel>
									<Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""} disabled={sourcePending}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select lead source" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sourceData?.sources.map((source: GetSourceOutput) => (
												<SelectItem key={source.id} value={String(source.id)}>
													{toTitleCase(source.name)}
												</SelectItem>
											))}
											<MangeSourceOrProduct type="sources" />
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="product_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product*</FormLabel>
									<Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""} disabled={productPending}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select Product" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{productData?.products.map((product: GetProductOutput) => (
												<SelectItem key={product.id} value={String(product.id)}>
													{capitalize(product.name)}
												</SelectItem>
											))}
											<MangeSourceOrProduct type="products" />
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{user?.department === DEPARTMENTS[1] ? (
						<div className="space-y-2">
							<FormLabel className="mb-2">Select User*</FormLabel>
							{assignField.map((field, index) => (
								<FormField
									key={field.id}
									control={form.control}
									name={`assigned_to.${index}.id`}
									render={({ field }) => (
										<FormItem className="flex items-center gap-2 mb-2">
											<FormControl>
												<Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""} disabled={employeePending}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select user to assign" />
													</SelectTrigger>
													<SelectContent>
														{employeeData?.employees.map((employee: GetEmployeeOutput) => (
															<SelectItem key={employee.id} value={String(employee.id)}>
																{employee.first_name} {employee.last_name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<Button type="button" variant="destructive" onClick={() => assignRemove(index)}>
												<Trash />
											</Button>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
							<Button type="button" onClick={() => assignAppend({ id: 0 })} variant="outline">
								<Plus /> Add User
							</Button>
						</div>
					) : (
						<></>
					)}
				</div>
				<div className="flex justify-between">
					<Button variant="outline" onClick={handleClick}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Saving details.." : "Save Lead"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AddEditLeadDetails;
