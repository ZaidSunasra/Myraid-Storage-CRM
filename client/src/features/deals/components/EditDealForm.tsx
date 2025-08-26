import { FetchCompanies, FetchCompanyEmployee } from "@/api/company/company.queries"
import { FetchSources } from "@/api/sources/source.queries"
import { FetchProducts } from "@/api/products/product.queries"
import { FetchSalesEmployee } from "@/api/employees/employee.queries"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/shared/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { DEAL_STATUS, dealSchema, type AddDeal, type Assignee, type Company, type GetDealOutput, type GetEmployeeOutput } from "zs-crm-common"
import { useFieldArray } from "react-hook-form"
import { capitalize, toTitleCase } from "@/utils/formatData"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditDeal } from "@/api/deals/deal.mutation"
import ManageSourceOrProduct from "@/shared/components/ManageSourceOrProduct"

const EditDealDetails = ({ data }: { data: GetDealOutput }) => {

    const editDeal = useEditDeal();
    const form = useForm<AddDeal>({
        resolver: zodResolver(dealSchema),
        defaultValues: {
            company_id: String(data.company_id),
            employee_id: String(data.client_id),
            source_id: data.source_id,
            product_id: data.product_id,
            deal_status: data.deal_status,
            assigned_to: data.assigned_to.map((i: Assignee) => ({
                id: i.user.id,
            })),
        },
    })

    const onSubmit = (formData: AddDeal) => {
        editDeal.mutate({ data: formData, id: data.id })
    }

    const [selectedCompany, setSelectedCompany] = useState<Company | null>(data.company)

    const { data: companyData, isPending: companyPending } = FetchCompanies("")
    const { data: sourceData, isPending: sourcePending } = FetchSources()
    const { data: productData, isPending: productPending } = FetchProducts()
    const { data: employeeData, isPending: employeePending } = FetchSalesEmployee()
    const { data: companyEmployeeData, isPending: companyEmployeePending } = FetchCompanyEmployee(selectedCompany?.id as number)

    const { fields: assignField, append: assignAppend, remove: assignRemove, } = useFieldArray({
        control: form.control, name: "assigned_to",
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="border-0 shadow-lg bg-background">
                    <CardHeader>
                        <CardTitle>Edit Deal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="company_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Company*</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="flex justify-between"
                                                        disabled={companyPending}
                                                    >
                                                        {companyData?.companies.find(
                                                            (c) => String(c.id) === field.value
                                                        )?.name || "Select company"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search company..." />
                                                    <CommandEmpty>No company found.</CommandEmpty>
                                                    <CommandGroup className="max-h-64 overflow-auto">
                                                        {companyData?.companies.map((company) => (
                                                            <CommandItem
                                                                key={company.id}
                                                                className="cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                                                                onSelect={() => {
                                                                    field.onChange(String(company.id))
                                                                    setSelectedCompany(company)
                                                                    form.setValue("employee_id", "")
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === String(company.id)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {company.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="employee_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee*</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={companyEmployeePending}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companyEmployeeData?.employees.map((employee) => (
                                                    <SelectItem
                                                        key={employee.id}
                                                        value={String(employee.id)}
                                                    >
                                                        {employee.first_name} {employee.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="source_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source*</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : ""}
                                            disabled={sourcePending}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sourceData?.sources.map((source) => (
                                                    <SelectItem
                                                        key={source.id}
                                                        value={String(source.id)}
                                                    >
                                                        {capitalize(source.name)}
                                                    </SelectItem>
                                                ))}
                                                 <ManageSourceOrProduct type="sources"/>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="product_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product*</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value ? String(field.value) : ""}
                                            disabled={productPending}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productData?.products.map((product) => (
                                                    <SelectItem
                                                        key={product.id}
                                                        value={String(product.id)}
                                                    >
                                                        {capitalize(product.name)}
                                                    </SelectItem>
                                                ))}
                                                 <ManageSourceOrProduct type="products"/>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deal_status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status*</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEAL_STATUS.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {toTitleCase(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <FormLabel className="mb-2">Assign Users*</FormLabel>
                                {assignField.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`assigned_to.${index}.id`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col mb-2">
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value ? String(field.value) : ""}
                                                            disabled={employeePending}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select user to assign" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {employeeData?.employees.map(
                                                                    (employee: GetEmployeeOutput) => (
                                                                        <SelectItem
                                                                            key={employee.id}
                                                                            value={String(employee.id)}
                                                                        >
                                                                            {employee.first_name} {employee.last_name}
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => assignRemove(index)}
                                                    >
                                                        <Trash />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => assignAppend({ id: 0 })}
                                    variant="outline"
                                >
                                    <Plus /> Add User
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button type="submit" disabled={editDeal.isPending}>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}

export default EditDealDetails;
