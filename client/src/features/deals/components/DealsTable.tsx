import { FetchDeals } from "@/api/deals/deal.queries";
import useDebounce from "@/hooks/useDebounce";
import useQueryParams from "@/hooks/useQueryParams";
import SearchFilterBar from "@/shared/components/SearchFilter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Kanban, Table } from "lucide-react";
import { useEffect, useState } from "react";
import DealsTableBody from "./DealsTableBody";
import KanbanBoard from "./DealsKanbanBoard";
import TableLoader from "@/shared/components/loaders/TableLoader";
import ErrorDisplay from "@/shared/components/ErrorPage";

const DealsTable = () => {

    const { rows, page, search, employeeIDs, startDate, endDate, sources, setSearch, setSearchParams } = useQueryParams();
    const { data: dealsData, isError: dealsError, isPending: dealsPending } = FetchDeals({rows, page, search, employeeIDs, startDate, endDate, sources});
    const [searchInput, setSearchInput] = useState(search);
    const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
    const debouncedSearch = useDebounce(searchInput, 500);

    useEffect(() => {
        setSearch(debouncedSearch, search);
    }, [debouncedSearch, search, setSearchParams]);

    if (dealsPending) return <TableLoader />

    if (dealsError) return <ErrorDisplay message="Failed to display data. Refresh or please try again later"/>

    return <Card className="mb-6 bg-background">
        <CardHeader>
            <SearchFilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
        </CardHeader>
        <CardContent>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "kanban")}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <CardTitle>Deals Pipeline</CardTitle>
                        <CardDescription>Track and manage your sales opportunities</CardDescription>
                    </div>
                    <TabsList>
                        <TabsTrigger value="table" className="flex items-center space-x-2">
                            <Table className="h-4 w-4" />
                            <span>Table</span>
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className="flex items-center space-x-2">
                            <Kanban className="h-4 w-4" />
                            <span>Kanban</span>
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="table">
                    <DealsTableBody data={dealsData} />
                </TabsContent>
                <TabsContent value="kanban">
                    <KanbanBoard data={dealsData}/>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>

}

export default DealsTable