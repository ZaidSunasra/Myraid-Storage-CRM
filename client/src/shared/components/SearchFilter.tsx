import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/shared/components/ui/command";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ChevronsUpDown, Search, X } from "lucide-react";
import useQueryParams from "@/hooks/useQueryParams";
import { FetchSalesEmployee } from "@/api/employees/employee.queries";
import TableLoader from "@/shared/components/loaders/TableLoader";
import { useUser } from "@/context/UserContext";
import { DEPARTMENTS } from "zs-crm-common";

const SearchFilterBar = ({ searchInput, setSearchInput }: { searchInput: string; setSearchInput: (val: string) => void; }) => {

    const { toggleEmployee, setRows, rows, employeeIDs, clearFilter } = useQueryParams();
    const { data: employeeData, isError: employeeError, isPending: employeePending } = FetchSalesEmployee();
    const { user } = useUser();

    if (employeePending) return <TableLoader />;

    return <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative w-full md:w-[270px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-foreground h-4 w-4" />
            <Input
                placeholder="Search by name or company"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 text-accent-foreground"
            />
        </div>

        {user?.department == DEPARTMENTS[1] && !employeeError &&(
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex justify-between">
                        Filter by employees
                        <ChevronsUpDown />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                    <Command>
                        <CommandInput placeholder="Search employees..." />
                        <CommandList>
                            <CommandEmpty>No employees found.</CommandEmpty>
                            <CommandGroup>
                                {employeeData.employees.map((emp) => (
                                    <CommandItem key={emp.id}>
                                        <Checkbox
                                            className="mr-2"
                                            checked={employeeIDs.includes(String(emp.id))}
                                            onCheckedChange={() => toggleEmployee(String(emp.id))}
                                        />
                                        {emp.first_name} {emp.last_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )}

        <Select onValueChange={setRows} value={String(rows)}>
            <SelectTrigger className="w-full md:w-18">
                <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
            </SelectContent>
        </Select>

        <Button variant="ghost" onClick={() => {
            setSearchInput(""),
                clearFilter()
        }}>
            <X className="h-4 w-4" /> Clear filter
        </Button>
    </div>
};

export default SearchFilterBar;
