import { FetchCompanies, FetchCompanyEmployee } from "@/api/company/company.queries"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Building2, Check, ChevronRight, ChevronsUpDown, Mail, Phone, User } from "lucide-react"
import { type UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { type AddDeal, type Client_Details, type Company } from "zs-crm-common"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"

const AddCompanyDetails = ({ form, handleNext }: { form: UseFormReturn<AddDeal>, handleNext: () => void }) => {

    const [selectedEmployee, setSelectedEmployee] = useState<Client_Details | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const { data: companyData, isPending: companyPending } = FetchCompanies("");
    const { data: employeeData, isPending: employeePending } = FetchCompanyEmployee(selectedCompany?.id as number);

    if (companyPending) return <>Loading</>;

    return <Card className="border-0 shadow-lg bg-background">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 text-blue-600" />
                Client & Company Information
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-semibold">Company*</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="justify-between w-full  bg-white"
                                        >
                                            {selectedCompany ? (
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                    <span>{selectedCompany.name}</span>
                                                </div>
                                            ) : (
                                                "Search company..."
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search company..." />
                                        <CommandList>
                                            <CommandEmpty>No company found.</CommandEmpty>
                                            <CommandGroup>
                                                {companyPending ? <>Loading</> : <>
                                                    {companyData?.companies.map((company: Company) => (
                                                        <CommandItem
                                                            key={company.id}
                                                            onSelect={() => {
                                                                field.onChange(String(company.id), form.resetField("employee_id"))
                                                                setSelectedCompany(company)
                                                            }}
                                                            defaultValue={field.value}
                                                            className="flex items-center gap-2 p-3"
                                                        >
                                                            <Check
                                                                className={`mr-2 h-4 w-4 ${selectedCompany?.id === company.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                                    }`}
                                                            />
                                                            <Building2 className="h-4 w-4 text-blue-600" />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{company.name}</span>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </>}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {employeeData && (
                    <FormField
                        control={form.control}
                        name="employee_id"
                        render={({ field }) => (
                            <div className="flex flex-col space-y-2">
                                <Label className="text-sm font-semibold">Employee*</Label>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        const employee = employeeData?.employees?.find(
                                            (emp: Client_Details) => String(emp.id) === value
                                        );
                                        setSelectedEmployee(employee ? employee : null);
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                    disabled={employeePending}
                                >
                                    <SelectTrigger className="h-12 bg-white w-full">
                                        <SelectValue
                                            placeholder={
                                                employeePending
                                                    ? "Loading employees..."
                                                    : "Select employee..."
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employeeData?.employees?.map((employee: Client_Details) => (
                                            <SelectItem key={employee.id} value={String(employee.id)}>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-green-600" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {employee.first_name} {employee.last_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                )}
            </div>
            {selectedEmployee && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Contact Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-gray-600">First Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="bg-gray-50 text-sm"
                                    value={selectedEmployee.first_name}
                                    readOnly
                                />
                            </FormControl>
                        </FormItem>
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-gray-600">Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="bg-gray-50 text-sm"
                                    value={selectedEmployee.last_name}
                                    readOnly
                                />
                            </FormControl>
                        </FormItem>
                        <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-medium text-gray-600">Phone</FormLabel>
                            <div className="space-y-2">
                                {selectedEmployee.phones?.length ? (
                                    selectedEmployee.phones.map((p: { phone: string }) => (
                                        <div key={p.phone} className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                className="bg-gray-50 text-sm pl-10"
                                                value={p.phone}
                                                readOnly
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <Input className="bg-gray-50 text-sm" value="N/A" readOnly />
                                )}
                            </div>
                        </FormItem>
                        <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-medium text-gray-600">Email</FormLabel>
                            <div className="space-y-2">
                                {selectedEmployee.emails?.length ? (
                                    selectedEmployee.emails.map((e: { email: string | null }, idx: number) => (
                                        <div key={idx} className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                className="bg-gray-50 text-sm pl-10"
                                                value={e.email ? e.email : ""}
                                                readOnly
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <Input className="bg-gray-50 text-sm" value="N/A" readOnly />
                                )}
                            </div>
                        </FormItem>
                    </div>
                </div>
            )}
            <div className="flex justify-end">
                <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </CardContent>
    </Card >
}

export default AddCompanyDetails