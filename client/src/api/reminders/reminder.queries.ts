import { useQuery } from "@tanstack/react-query";
import { getReminderByMonth, getReminders } from "./reminders.api";

export const FetchReminders = (id: string, type: "deal" | "lead") => {
	return useQuery({ queryKey: ["reminders", id], queryFn: () => getReminders(id, type) });
};

export const FetchReminderByMonth = (month: string) => {
	return useQuery({ queryKey: ["reminderByMonth", month], queryFn: () => getReminderByMonth(month) });
};
