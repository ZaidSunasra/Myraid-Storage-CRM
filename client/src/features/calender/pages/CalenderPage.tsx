import { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameDay } from "date-fns";
import DailyData from "../components/DailyData";
import { FetchReminderByMonth } from "@/api/reminders/reminder.queries";
import {formatDate} from "@/utils/formatDate";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import CalenderPageLoader from "../components/CalenderPageLoader";
import ErrorPage from "@/shared/components/ErrorPage";

const CalendarPage = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const { data, isError, isPending } = FetchReminderByMonth(formatDate(currentMonth));

	const days = (() => {
		const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
		const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

		const daysArr: Date[] = [];
		let day = start;

		while (day <= end) {
			daysArr.push(day);
			day = addDays(day, 1);
		}

		return daysArr;
	})();

	const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
	const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));

	if (isPending) return <CalenderPageLoader />;
	if (isError) return <ErrorPage fullPage/>;

	return (
		<div className="bg-accent min-h-screen">
			<Navbar />
			<div className="p-4 max-w-7xl mx-auto bg-background mt-8 rounded-lg">
				<div className="mb-4 flex justify-end">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Select Month & Year</Button>
						</PopoverTrigger>
						<PopoverContent className="w-fit">
							<div className="space-y-2">
								<div className="font-medium text-sm">Jump to Month</div>
								<Input
									type="month"
									className="border rounded px-3 py-2 text-sm w-full"
									value={format(currentMonth, "yyyy-MM")}
									onChange={(e) => {
										const selectedDate = new Date(`${e.target.value}-01`);
										setCurrentMonth(selectedDate);
									}}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex items-center justify-between mb-4">
					<Button onClick={prevMonth} className="text-sm px-2 py-1 border rounded">
						<ChevronLeft />
						Previous
					</Button>
					<h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
					<Button onClick={nextMonth} className="text-sm px-2 py-1 border rounded">
						Next
						<ChevronRight />
					</Button>
				</div>
				<div className="hidden lg:grid grid-cols-7 gap-2 text-center font-semibold mb-2 text-sm text-muted-foreground">
					<div>Sun</div>
					<div>Mon</div>
					<div>Tue</div>
					<div>Wed</div>
					<div>Thu</div>
					<div>Fri</div>
					<div>Sat</div>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
					{days.map((day) => {
						const formatted = format(day, "yyyy-MM-dd");
						const meetings = data.remindersByDay[formatted] || [];
						return (
							<div key={formatted}>
								{
									<Sheet>
										<SheetTrigger asChild>
											<div
												className={`
                                                 border rounded-lg p-3 min-h-28 flex flex-col justify-between transition-all duration-200 h-full
                                                 hover:bg-blue-100 hover:border-blue-500 shadow-sm 
                                                 ${format(day, "MM") !== format(currentMonth, "MM") ? "opacity-30" : ""} 
                                                 ${isSameDay(formatted, new Date()) ? "border-blue-500 ring-2 ring-blue-400" : ""} 
                                             `}
											>
												<div className="text-sm font-semibold text-gray-800">{format(day, "d")}</div>
												{meetings.length > 0 && (
													<div className="mt-2 flex items-center justify-between text-sm text-gray-700">
														<span className="font-bold">Meetings</span>
														<span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">{meetings.length}</span>
													</div>
												)}
											</div>
										</SheetTrigger>
										<SheetContent>
											<SheetHeader>
												<SheetTitle>Team Activity Recap for {format(formatted, "dd-MM-yyyy")}</SheetTitle>
												<SheetDescription>Catch up on today's progress — leads added, client updates, and who did what. Everything you need to stay informed.</SheetDescription>
											</SheetHeader>
											<DailyData data={data.grouped[formatted]} meetingData={data.remindersByDay[formatted]} />
										</SheetContent>
									</Sheet>
								}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;
