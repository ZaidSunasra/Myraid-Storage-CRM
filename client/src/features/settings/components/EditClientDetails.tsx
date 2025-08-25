import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Plus, Trash, User } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { editClientSchema, type Client_Details, type EditClient } from "zs-crm-common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddClient, useEditClient } from "@/api/company/company.mutations";
import type { Dispatch, SetStateAction } from "react";

const EditClientDetails = ({ employee, setSelectedEmployee}: { employee: Client_Details | null, setSelectedEmployee: Dispatch<SetStateAction<Client_Details | null>>}) => {

    const addClient = useAddClient();
    const editClient = useEditClient();

    const form = useForm<EditClient>({
        resolver: zodResolver(editClientSchema),
        defaultValues: ({
            first_name: employee?.first_name,
            last_name: employee?.last_name,
            emails: employee?.emails?.filter((e): e is { email: string } => e.email !== null)
                .map((e) => ({ email: e.email })) || [],
            phones: employee?.phones?.map((p: { phone: string }) => ({ number: p.phone })) || [],
            id: String(employee?.id)
        }),
    });

    const { fields: emailFields, append: emailAppend, remove: emailRemove } = useFieldArray({
        control: form.control,
        name: "emails",
    });

    const { fields: phoneFields, append: phoneAppend, remove: phoneRemove } = useFieldArray({
        control: form.control,
        name: "phones",
    });

    const onSubmit = (data: EditClient) => {
        if (employee?.id) {
            editClient.mutate({ data, id: employee?.company_id as number })
        }
        else {
            addClient.mutate({ data, id: employee?.company_id as number })
        }
        setSelectedEmployee(null)
    }

    return <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Lead Details</span>
            </CardTitle>
            <CardDescription>Enter the contact person and product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                            <FormLabel className="mb-2">Phone Numbers*</FormLabel>
                            {phoneFields.map((field, index) => (
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
                            <Button type="button" onClick={() => phoneAppend({ number: "" })} variant="outline">
                                <Plus /> Add Phone
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" >
                            {employee?.id ? "Save changes" : "Add client"}
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default EditClientDetails