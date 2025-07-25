import { useEditDescription } from "@/api/leads/leads.mutation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mention, MentionsInput } from "react-mentions";
import { addDescriptionSchema, type AddDescription, type GetDescriptionOutput } from "zs-crm-common";
import { mentionStyle } from "@/utils/mentionStyle";

const EditDescription = ({ data, setOpen, employee }: { data: GetDescriptionOutput; setOpen: React.Dispatch<React.SetStateAction<boolean>>; employee: { id: number; display: string }[] }) => {
	const editDescription = useEditDescription();

	const form = useForm<AddDescription>({ resolver: zodResolver(addDescriptionSchema), defaultValues: { description: data.notes } });

	const id = data.id;

	const onSubmit = (data: AddDescription) => {
		editDescription.mutate({ data: { description: data.description }, id: String(id) });
		setOpen(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="mb-4">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<MentionsInput value={field.value} onChange={(e) => field.onChange(e.target.value)} style={mentionStyle}>
									<Mention trigger="@" data={employee} displayTransform={(_id, display) => `@${display}`} markup="@[__display__] (__id__)" appendSpaceOnAdd style={{ backgroundColor: "#cee4e5" }} />
								</MentionsInput>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Add Description</Button>
			</form>
		</Form>
	);
};

export default EditDescription;
