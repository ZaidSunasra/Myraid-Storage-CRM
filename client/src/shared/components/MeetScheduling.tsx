import { useForm } from "react-hook-form";
import { addReminderSchema, type AddReminder } from "zs-crm-common";
import { cn } from "@/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, startOfDay } from "date-fns";
import { useAddReminder } from "@/api/reminders/reminder.mutation";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Textarea } from "@/shared/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { setHoursAndMinutes } from "@/utils/formatDate";

const MeetScheduling = ({ type, id }: { type: "deal" | "lead", id: string }) => {

	const [time, setTime] = useState<string>("09:00");
	const saveReminder = useAddReminder();
	const form = useForm({ resolver: zodResolver(addReminderSchema), defaultValues: { title: "", send_at: undefined, message: "", reminder_type: "client_meeting"} });

	const onSubmit = (data: AddReminder) => {
		const sendAt = data.send_at;
		data.type = type;
		if (sendAt && time) {
			data.send_at = setHoursAndMinutes(time, sendAt);
		}
		saveReminder.mutate({ data, id: id as string }, {
			onSuccess: () => {
				form.reset();
			}
		});
	};

	return <Form {...form}>
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Schedule Meeting</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button variant={"outline"} className={cn("w-1/2 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
															{field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
					<Button type="submit">Schedule Meeting</Button>
				</CardContent>
			</Card>
		</form>
	</Form>
};

export default MeetScheduling;
