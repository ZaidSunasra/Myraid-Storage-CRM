export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export const setHoursAndMinutes = (time: string, send_at: Date): Date => {
	const [hours, minutes] = time.split(":").map(Number);
	send_at.setHours(hours, minutes, 0, 0);
	return send_at;
}
