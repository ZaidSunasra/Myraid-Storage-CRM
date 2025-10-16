import Navbar from "@/shared/components/Navbar";
import { Skeleton } from "@/shared/components/ui/skeleton";

const DetailedPageLoader = () => {
	return (
		<div className="min-h-screen bg-accent">
			<Navbar />
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-0 py-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<Skeleton className="h-10 w-10 rounded-md bg-background" />
							<div>
								<Skeleton className="h-6 w-48 mb-2 bg-background" />
								<Skeleton className="h-4 w-32 bg-background" />
							</div>
						</div>
						<Skeleton className="h-10 w-28 rounded-md bg-background" />
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3 space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="h-10 bg-background" />
							<Skeleton className="h-10 bg-background" />
						</div>
						<div className="space-y-6">
							<div className="space-y-4">
								<Skeleton className="h-64 w-full bg-background" />
							</div>
							<div className="space-y-3">
								<Skeleton className="h-50 w-full bg-background" />
							</div>
						</div>
					</div>
					<div className="lg:col-span-1">
						{/* <LeadSideBar /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailedPageLoader;
