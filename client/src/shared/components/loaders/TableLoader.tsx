import { Skeleton } from "@/shared/components/ui/skeleton";

const TableLoader = () => {
	return (
		<div className="mb-6">
			<div className="flex flex-col md:flex-row gap-4 h-9 mb-5">
				<Skeleton className="flex-1 w-full md:w-[270px] bg-background " />
				<Skeleton className="w-64 bg-background" />
				<Skeleton className="w-full md:w-18 bg-background" />
				<Skeleton className="w-full md:w-28 bg-background" />
			</div>
			<div className="overflow-x-auto">
				{Array.from({ length: 15 }).map((_, i) => (
					<div key={i} className="flex w-full">
						<Skeleton className="w-full h-10 bg-background mb-3" />
					</div>
				))}
			</div>
		</div>
	);
};

export default TableLoader;
