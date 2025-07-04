import { fetchEmployees } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArrowLeft, Plus, Trash, User } from "lucide-react";
import { useFieldArray } from "react-hook-form";

const AddEditLeadDetails = ({ form, handleClick }: { form: any, handleClick: () => void }) => {

    const { data: employeeData, isError: employeeError, isPending: employeePending } = fetchEmployees();

    const { fields: phoneField, append: phoneAppend, remove: phoneRemove } = useFieldArray({
        control: form.control,
        name: "phones",
    });

    const { fields: emailFields, append: emailAppend, remove: emailRemove } = useFieldArray({
        control: form.control,
        name: "emails",
    });

    const { fields: assignField, append: assignAppend, remove: assignRemove } = useFieldArray({
        control: form.control,
        name: "assigned_to",
    });

    if (employeePending) return <>Loading...</>
    if (employeeError) return <>Erroor..</>

    return <Card>
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
                    <Button type="button" onClick={() => emailAppend({ email: "" })} variant="outline" >
                        <Plus />Add Email
                    </Button>
                </div>
                <div className="space-y-2">
                    <FormLabel className="mb-2">Phone Numbers *</FormLabel>
                    {phoneField.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`phones.${index}.number`}
                            render={({ field }) => (
                                <FormItem className="">
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input {...field} placeholder="Enter phone number" />
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
                    <Button type="button" onClick={() => phoneAppend({ number: "" })} variant="outline" >
                        <Plus /> Add Phone
                    </Button>
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select lead source" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="google_ads">Google Ads</SelectItem>
                                        <SelectItem value="india_mart">India Mart</SelectItem>
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
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="compactor">Compactor</SelectItem>
                                        <SelectItem value="locker">Locker</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select user to assign" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeeData.employees.map((employee: any) => (
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
                    <Button type="button" onClick={() => assignAppend({ id: "" })} variant="outline" >
                        <Plus /> Add User
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea id="description" placeholder="Add any additional notes or description about the lead" rows={4}  {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-between">
                <Button variant="outline" onClick={handleClick}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button type="submit" >
                    Save Lead
                </Button>
            </div>
        </CardContent>
    </Card >
}

export default AddEditLeadDetails;