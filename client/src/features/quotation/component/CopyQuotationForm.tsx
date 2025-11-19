import { FetchOnlyDealId } from '@/api/deals/deal.queries';
import { useCopyQuotation } from '@/api/quotations/quotations.mutation';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Skeleton } from '@/shared/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router'
import { copyQuotationschema, type CopyQuotation } from 'zs-crm-common';
import { Check } from 'lucide-react';
import { useState } from 'react';

const CopyQuotationForm = () => {

    const { quotation_id } = useParams();
    const { data, isLoading } = FetchOnlyDealId();
    const copyQuotation = useCopyQuotation();
    const [open, setOpen] = useState<boolean>(false);

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
                            <FormItem className="flex flex-col">
                                <FormLabel>Deal Id*</FormLabel>
                                <Popover open={open} onOpenChange={setOpen} modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="justify-between w-full"
                                            >
                                                {field.value
                                                    ? field.value.replace(/-/g, "/").replace(/_/g, "-")
                                                    : "Search Deal ID..."}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-[350px]">
                                        <Command>
                                            <CommandInput placeholder="Search deal ID..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                <CommandGroup heading="Deal IDs">
                                                    {data?.dealIds.map((item) => {
                                                        const formatted = item.id
                                                            .replace(/-/g, "/")
                                                            .replace(/_/g, "-");
                                                        return (
                                                            <CommandItem
                                                                key={item.id}
                                                                value={item.id}
                                                                onSelect={() => {
                                                                    field.onChange(item.id);
                                                                    form.setValue("quotation_no", item.id, {
                                                                        shouldValidate: true,
                                                                    });
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {formatted}
                                                                {field.value === item.id && (
                                                                    <Check className="ml-auto h-4 w-4" />
                                                                )}
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
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