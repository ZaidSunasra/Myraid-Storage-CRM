import { FetchReminders } from "@/api/reminders/reminder.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { useDeleteReminder } from "@/api/reminders/reminder.mutation";
import { useState } from "react";
import EditReminder from "./EditMeeting";
import { type Reminders } from "zs-crm-common";
import { capitalize, toTitleCase } from "@/utils/formatData";
import { format } from "date-fns";
import ErrorDisplay from "./ErrorPage";
import DivLoader from "./loaders/DivLoader";

const ScheduledMeeting = ({id, type} : {id: string, type: "lead" | "deal"}) => {

	const { data, isPending, isError } = FetchReminders(id as string, type);
	const deleteReminder = useDeleteReminder();

	const [dialog, setDialog] = useState<{ open: boolean; data: string | null | Reminders | number; action: "edit" | "delete" | null }>({ open: false, data: null, action: null });

	const onSubmit = () => {
		deleteReminder.mutate(String(dialog.data));
		setDialog({ open: false, data: null, action: null });
	};

	if (isPending) return <DivLoader showHeading={false} height={64}/>

	if (isError) return <ErrorDisplay message="Failed to load data. Refresh or please try again later"/>
	
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Reminders</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{data.reminders.map((meeting: Reminders) => (
							<div key={meeting.id} className="grid grid-cols-5 md:grid-cols-9 items-center p-4 border rounded-lg gap-4">
								<div className="col-span-1 flex justify-center">
									<div className="p-2 bg-blue-100 rounded-full">
										<CalendarIcon className="h-4 w-4 text-blue-600" />
									</div>
								</div>
								<div className="col-span-4 space-y-1">
									<h4 className="font-medium break-words">{toTitleCase(meeting.title)}</h4>
									<p className="text-sm text-gray-600 break-words">{meeting.message ? capitalize(meeting.message) : ""}</p>
								</div>
								<div className="col-span-3 md:col-span-3">
									<h4 className="font-medium">Meeting Schedule</h4>
									<div className="text-sm text-gray-600 flex items-center break-words">
										<CalendarIcon className="h-3 w-3 mr-1 hidden sm:block" />
										{format(meeting.send_at as Date, "dd/MM/yyyy hh:mm a")}
									</div>
								</div>
								<div className="col-span-2 md:col-span-1 flex justify-end gap-2 md:gap-4">
									<Button
										variant="destructive"
										onClick={() => {
											setDialog({ open: true, data: meeting.id, action: "delete" });
										}}
									>
										<Trash className="h-4 w-4" />
									</Button>
									<Button
										className="bg-green-600"
										onClick={() => {
											setDialog({ open: true, data: meeting, action: "edit" });
										}}
									>
										<Pencil className="h-4 w-4 " />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
				<DialogTrigger asChild></DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					{dialog.action == "delete" ? (
						<>
							<DialogHeader>
								<DialogTitle>Delete Reminder</DialogTitle>
								<DialogDescription>Are you sure you want to delete? This cannot be undone.</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" variant="destructive" onClick={() => onSubmit()}>
									Delete
								</Button>
							</DialogFooter>
						</>
					) : dialog.action === "edit" ? (
						<>
							<DialogHeader>
								<DialogTitle>Edit Reminder</DialogTitle>
								<DialogDescription>Update the details of the reminder.</DialogDescription>
							</DialogHeader>
							<EditReminder data={dialog.data as Reminders} dialog={setDialog} />
						</>
					) : (
						<></>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ScheduledMeeting;
