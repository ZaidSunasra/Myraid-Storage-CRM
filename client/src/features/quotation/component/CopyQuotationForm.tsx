import { FetchOnlyDealId } from '@/api/deals/deal.queries';
import { useCopyQuotation } from '@/api/quotations/quotations.mutation';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router'
import { copyQuotationschema, type CopyQuotation } from 'zs-crm-common';

const CopyQuotationForm = () => {

    const { quotation_id } = useParams();
    const { data, isLoading } = FetchOnlyDealId();
    const copyQuotation = useCopyQuotation()

    const form = useForm<CopyQuotation>({
        resolver: zodResolver(copyQuotationschema),
        defaultValues: {
            deal_id: "",
            quotation_no: ""
        },
    })

    const onSubmit = (data: CopyQuotation) => {
        copyQuotation.mutate({ id: quotation_id as string, data })
        console.log(data)
    }

    if (isLoading) return <Skeleton className='h-48 w-96' />

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="deal_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deal Id*</FormLabel>
                                <Select value={field.value ? field.value : ""} onValueChange={(val) => {field.onChange(val), form.setValue("quotation_no", val, { shouldValidate: true });}}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Quotation Template" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {data?.dealIds.map((id: { id: string }) => (
                                            <SelectItem key={id.id} value={id.id} className='font-medium'>
                                                {id.id.replace(/-/g, "/").replace(/_/g, "-")}
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
                        name="quotation_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quotation No.*</FormLabel>
                                <Input {...field} placeholder="Enter quotation no" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button className='mt-4 flex' disabled={copyQuotation.isPending}>Copy Quotation Details</Button>
                </div>
            </form>
        </Form>
    )
}

export default CopyQuotationForm