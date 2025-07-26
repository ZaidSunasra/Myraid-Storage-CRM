import { Button } from "@/shared/components/ui/button";
import { ChevronsLeftIcon, ChevronsRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import useQueryParams from "@/hooks/useQueryParams";

const PaginationControls = ({ lastPage }: {lastPage: number}) => {
    const { setPage, page } = useQueryParams()
    return (
        <div className="flex gap-2 mt-4 lg:ml-0 justify-center">
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeftIcon />
            </Button>
            <Button variant="outline" className="size-8" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeft />
            </Button>
            <span className="mx-2">Page {page} of {lastPage}</span>
            <Button variant="outline" className="size-8" onClick={() => setPage(page + 1)} disabled={page === lastPage}>
                <ChevronRight />
            </Button>
            <Button variant="outline" className="size-8" onClick={() => setPage(lastPage)} disabled={page === lastPage}>
                <ChevronsRightIcon />
            </Button>
        </div>
    );
};

export default PaginationControls;
