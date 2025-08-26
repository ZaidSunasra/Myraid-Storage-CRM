import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const EditPageLoader = ({ showSidebar }: { showSidebar: boolean }) => {
	return (
		<div className="bg-accent min-h-screen">
			<Navbar />
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex items-center space-x-4 mb-6">
						<Button variant="ghost" size="icon" disabled>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div>
							<Skeleton className="h-8 w-48 mb-2 rounded-md bg-background" />
							<Skeleton className="h-6 w-64 rounded-md bg-background" />
						</div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
						{showSidebar &&
							<div className="lg:col-span-1">
								<Skeleton className="h-62 w-full rounded-md bg-background" />
							</div>
						}
						<div className={`${showSidebar ? "lg:col-span-3" : "lg:col-span-4"} space-y-6`}>
							<Skeleton className="h-[350px] w-full rounded-md bg-background" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditPageLoader;
