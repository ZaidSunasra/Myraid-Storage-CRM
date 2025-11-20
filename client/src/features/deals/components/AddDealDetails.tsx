import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { ArrowLeft, Building2, Plus, Trash } from "lucide-react"
import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { DEAL_STATUS, type AddDeal, type GetEmployeeOutput, type Product, type Source } from "zs-crm-common"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { FetchSources } from "@/api/sources/source.queries"
import { FetchProducts } from "@/api/products/product.queries"
import { capitalize } from "@/utils/formatData"
import { FetchSalesEmployee } from "@/api/employees/employee.queries"
import ManageSourceOrProduct from "@/shared/components/ManageSourceOrProduct"

const AddDealDetails = ({ form, handlePrev, isLoading}: { form: UseFormReturn<AddDeal>, handlePrev : () => void, isLoading:boolean}) => {

    const { data: sourceData, isPending: sourcePending } = FetchSources();
    const { data: productData, isPending: productPending } = FetchProducts();
    const { data: salesEmployeeData, isPending: salesEmployeePending } = FetchSalesEmployee();

    const { fields: assignField, append: assignAppend, remove: assignRemove } = useFieldArray({ control: form.control, name: "assigned_to" });

    return <Card className="border-0 shadow-lg bg-background">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 text-blue-600" />
                Deal Information
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="product_id"
                    render={({ field }) => (
                        <div className="flex flex-col space-y-2">
                            <Label className="text-sm font-semibold">Product*</Label>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                disabled={productPending}
                            >
                                <SelectTrigger className="h-12 bg-white w-full">
                                    <SelectValue placeholder="Select Product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productData?.products?.map((product: Product) => (
                                        <SelectItem key={product.id} value={String(product.id)}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {capitalize(product.name)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                     <ManageSourceOrProduct type="products"/>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="source_id"
                    render={({ field }) => (
                        <div className="flex flex-col space-y-2">
                            <Label className="text-sm font-semibold">Source*</Label>
                            <Select
                                onValueChange={(val) => field.onChange(Number(val))}
                                disabled={sourcePending}
                            >
                                <SelectTrigger className="h-12 bg-white w-full">
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sourceData?.sources?.map((source: Source) => (
                                        <SelectItem key={source.id} value={String(source.id)}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {capitalize(source.name)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                    <ManageSourceOrProduct type="sources"/>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deal_status"
                    render={({ field }) => (
                        <div className="flex flex-col space-y-2">
                            <Label className="text-sm font-semibold">Deal Status*</Label>
                            <Select
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="h-12 bg-white w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEAL_STATUS.map((status: string) => (
                                        <SelectItem key={status} value={status}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {capitalize(status)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                />
                <div className="space-y-2">
                    <FormLabel className="h-5">Select User*</FormLabel>
                    {assignField.map((field, index) => (
                        <FormField
                            key={field.id}
                            control={form.control}
                            name={`assigned_to.${index}.id`}
                            render={({ field }) => (
                                <FormItem className="flex items-center">
                                    <FormControl>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""} disabled={salesEmployeePending}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={salesEmployeePending ? "Loading user..." : "Select user to assign"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salesEmployeeData?.employees.map((employee: GetEmployeeOutput) => (
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
            </div>
            <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving details.." : "Save Deal"}
                </Button>
            </div>
        </CardContent>
    </Card >
}

export default AddDealDetails;