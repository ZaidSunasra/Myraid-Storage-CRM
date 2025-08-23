import { memo } from "react"
import { type Client_Details } from "zs-crm-common"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface EmployeeSelectorProps {
    employees: Client_Details[]
    selectedEmployee: Client_Details | null
    onSelect: (emp: Client_Details) => void
    isLoading: boolean
}

const EmployeeSelector = memo(({ employees, selectedEmployee, onSelect, isLoading }: EmployeeSelectorProps) => (
    <Select
        value={String(selectedEmployee?.id || "")}
        onValueChange={(value) => {
            const emp = employees.find((e) => String(e.id) === value)
            if (emp) onSelect(emp)
        }}
        disabled={isLoading}
    >
        <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "Loading employees..." : "Select Employee"} />
        </SelectTrigger>
        <SelectContent>
            {employees.map((emp) => (
                <SelectItem key={emp.id} value={String(emp.id)}>
                    {emp.first_name} {emp.last_name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
))

export default EmployeeSelector;