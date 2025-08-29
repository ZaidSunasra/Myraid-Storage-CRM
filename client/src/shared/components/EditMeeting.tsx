import { useForm } from "react-hook-form";
import { addReminderSchema, type AddReminder, type Reminders } from "zs-crm-common";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, startOfDay } from "date-fns";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useEditReminder } from "@/api/reminders/reminder.mutation";
import { setHoursAndMinutes } from "@/utils/formatDate";

const EditMeeting = ({ data, dialog }: { data: Reminders; dialog: React.Dispatch<React.SetStateAction<{ open: boolean; data: Reminders | null | number | string; action: "edit" | "delete" | null }>> }) => {
	
	const [popoverOpen, setPopoverOpen] = useState(false)
	
	const getTime = () => {
		const sendAt = new Date(data.send_at as Date);
		const hours = String(sendAt.getHours()).padStart(2, "0");
		const minutes = String(sendAt.getMinutes()).padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	const [time, setTime] = useState<string>(getTime());
	const editReminder = useEditReminder();
	const reminderId = data.id;

	const form = useForm({ resolver: zodResolver(addReminderSchema), defaultValues: { title: data.title, send_at: data.send_at as Date, message: data.message as string, reminder_type: data.type } });

	const onSubmit = (data: AddReminder) => {
		const sendAt = data.send_at;
		if (sendAt && time) {
			data.send_at = setHoursAndMinutes(time, sendAt);
		}
		editReminder.mutate({ data, id: String(reminderId) });
		dialog({ open: false, data: null, action: null });
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="flex flex-col space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<div className="space-y-2">
										<FormLabel>Title*</FormLabel>
										<FormControl>
											<Input id="meeting-title" placeholder="Enter meeting title" {...field} />
										</FormControl>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="send_at"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<div className="space-y-2">
										<FormLabel>Date & Time of reminder*</FormLabel>
										<div className="flex space-x-2">
											<Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className={cn(
																"w-1/2 pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
														>
															{field.value
																? format(field.value as Date, "PPP")
																: <span>Pick a date</span>}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value as Date | undefined}	
														onSelect={(date) => {
															field.onChange(date)
															setPopoverOpen(false) 
														}}
														captionLayout="dropdown"
														 disabled={(date) => isBefore(date, startOfDay(new Date()))}
													/>
												</PopoverContent>
											</Popover>
											<Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-1/2" />
										</div>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<div className="space-y-2 ">
									<FormLabel>Meeting Notes</FormLabel>
									<FormControl>
										<Textarea id="meeting-notes" placeholder="Add meeting agenda or notes..." rows={3} {...field} />
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
					<Button type="submit">Edit Meeting</Button>
				</form>
			</Form>
		</>
	);
};

export default EditMeeting;
