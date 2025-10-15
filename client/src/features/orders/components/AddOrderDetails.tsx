import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { FetchDetailByQuotationNumber, FetchQuotationByDeal } from "@/api/quotations/quotation.queries"
import { useParams } from "react-router"
import ErrorDisplay from "@/shared/components/ErrorPage"
import { Skeleton } from "@/shared/components/ui/skeleton"
import type { UseFormReturn } from "react-hook-form"
import { useEffect } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { Calendar } from "@/shared/components/ui/calendar"
import { cn } from "@/shared/lib/utils"
import { ORDER_STATUS, type AddOrder } from "zs-crm-common"
import { toTitleCase } from "@/utils/formatData"

const AddOrderDetails = ({ form, context, isSubmitting}: { form: UseFormReturn<AddOrder>; context:  "edit" | "add", isSubmitting: boolean}) => {

    const { id } = useParams();
    const { data, isPending, isError } = FetchQuotationByDeal(id as string);
    const {
        data: quotationData,
        isFetching: quotationPending,
        error: quotationError,
        refetch: fetchQuotationDetail,
    } = FetchDetailByQuotationNumber(form.watch("quotation_no"));

    useEffect(() => {
        if (quotationData) {
            form.reset({
                height: quotationData.quotation.height,
                total_body: quotationData.quotation.total_body,
                total: Number(quotationData.quotation.grand_total),
                quotation_no: form.getValues("quotation_no"),
                status: "pending",
                deal_id: id ? String(id) : "",
                colour: "",
                pi_number: false,
                po_number: "",
                fitted_by: "",
                bill_number: ""
            });
        }
    }, [quotationData]);


    if (isPending) return <Skeleton className="h-4/5 w-3xs bg-background" />
    if (isError || quotationError) return <div><ErrorDisplay /></div>

    return <>
        <Card className="border-0 shadow-lg bg-background">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    Quotation No
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="quotation_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quotation Number*</FormLabel>
                                <Select value={field.value ? field.value : ""} onValueChange={(val) => field.onChange(val)} disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Product Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {data.quotations.map((quotation) => (
                                            <SelectItem key={quotation.id} value={quotation.quotation_no}>
                                                {quotation.quotation_no}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="button" disabled={form.watch("quotation_no") === ""} onClick={() => fetchQuotationDetail()}>
                        Fetch Details
                    </Button>
                </div>
            </CardContent>
        </Card >
        {(((context === "add" && quotationData) || context === "edit")) &&
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        Order Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="deal_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deal Id*</FormLabel>
                                        <Input
                                            value={field.value ?? "Enter deal id"}
                                            placeholder="Enter deal id"
                                            disabled
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="colour"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel>Colour*</FormLabel>
                                            <FormControl>
                                                <Input id="colour" placeholder="Enter colour" {...field} />
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
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height*</FormLabel>
                                        <Input
                                            {...field}
                                            placeholder="Enter compactor height"
                                            disabled={quotationPending}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="total_body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Body*</FormLabel>
                                        <Input
                                            placeholder="Enter total body"
                                            value={field.value ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            disabled={quotationPending}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount*</FormLabel>
                                        <Input
                                            placeholder="Enter total amount"
                                            value={field.value ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            disabled={quotationPending}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="pi_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PI Number</FormLabel>
                                        <Select value={String(field.value)} onValueChange={(val) => field.onChange(val === "true")}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select yes/no" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true">Yes</SelectItem>
                                                <SelectItem value="false">No</SelectItem>
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select value={String(field.value)} onValueChange={(val) => field.onChange(val)}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select yes/no" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ORDER_STATUS.map((status) => (
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
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="po_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PO Number</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter PO number"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="dispatch_at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-2">
                                            <FormLabel>Dispatch Date*</FormLabel>
                                            <div className="flex space-x-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal w-full", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 opacity-50 w-4" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange}
                                                            captionLayout="dropdown"
                                                            disabled={(date) => isBefore(date, startOfDay(new Date()))}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="bill_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bill Number</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter bill number"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="fitted_by"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fiited By</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter name"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={isSubmitting}>{context == "edit" ? "Save Changes" : "Add Order"}</Button>
                    </div>
                </CardContent>
            </Card>
        }
    </>
}

export default AddOrderDetails