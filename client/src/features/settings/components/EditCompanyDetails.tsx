import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Building2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { editCompanyDetailSchema, type Company, type EditCompany } from "zs-crm-common"
import { Input } from "@/shared/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/shared/components/ui/textarea";
import { useEditCompany } from "@/api/company/company.mutations"
import type { Dispatch, SetStateAction } from "react"

const EditCompanyDetails = ({ company, setSelectedCompany}: { company: Company | null, setSelectedCompany: Dispatch<SetStateAction<Company | null >>}) => {
    
    const editCompany = useEditCompany();
    const form = useForm<EditCompany>({
        resolver: zodResolver(editCompanyDetailSchema),
        defaultValues: ({
            company_name: company?.name,
            gst_no: company?.gst_no || "",
            address: company?.address
        }),
    });

    const onSubmit = (data: EditCompany) => {
        editCompany.mutate({data, id: company?.id as number});
        setSelectedCompany(null);
    }

    return <Card className="border-0 shadow-lg bg-background">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Information
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                    <FormItem className="col-span-1">
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
                        <div className="space-y-2 col-span-1 md:col-span-2">
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
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={editCompany.isPending}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card >
}

export default EditCompanyDetails
