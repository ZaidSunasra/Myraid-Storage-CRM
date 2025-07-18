import Navbar from "@/shared/components/Navbar";
import { Skeleton } from "@/shared/components/ui/skeleton";

const CalenderPageLoader = () => {
	return (
		<div className="bg-accent min-h-screen">
			<Navbar />
			<div className="p-4 max-w-7xl mx-auto bg-background mt-8 rounded-lg">
				<div className="mb-4 flex justify-end">
					<Skeleton className="h-10 w-48 rounded-md" />
				</div>
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-9 w-24 rounded-md" />
					<Skeleton className="h-7 w-40 rounded-md" />
					<Skeleton className="h-9 w-24 rounded-md" />
				</div>
				<div className="hidden lg:grid grid-cols-7 gap-2 text-center font-semibold mb-2 text-sm text-muted-foreground">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<Skeleton key={day} className="h-5 w-full" />
					))}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
					{Array.from({ length: 35 }).map((_, idx) => (
						<Skeleton key={idx} className="h-28 w-full rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
};

export default CalenderPageLoader;
