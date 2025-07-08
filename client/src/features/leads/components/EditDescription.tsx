import { useEditDescription } from "@/api/leads/leads.mutation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDescriptionSchema, type AddDescription } from "zs-crm-common";

const EditDescription = ({ data, setOpen }: { data: any,setOpen: any }) => {

    const editDescription = useEditDescription();

    const form = useForm<AddDescription>({
        resolver: zodResolver(addDescriptionSchema),
        defaultValues: ({
            description: data.notes,
        })
    });

    const id = data.id;

    const onSubmit = (data : AddDescription) => {
        editDescription.mutate({data: {description: data.description}, id: id});
        setOpen(false);
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="mb-4">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                id="description"
                                placeholder="Add lead description..."
                                rows={3}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">
                Add Description
            </Button>
        </form>
    </Form >
}

export default EditDescription;