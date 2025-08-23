import { memo } from "react"
import { type Company } from "zs-crm-common"
import { Button } from "@/shared/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Building2, Check, ChevronsUpDown } from "lucide-react"

interface CompanySelectorProps {
    companies: Company[]
    selectedCompany: Company | null
    onSelect: (company: Company) => void
    isLoading?: boolean
}

const CompanySelector = memo(({ companies, selectedCompany, onSelect, isLoading }: CompanySelectorProps) => {

    if (isLoading) return <Button variant="outline" disabled className="w-full">Loading companies...</Button>

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="justify-between w-full bg-white">
                    {selectedCompany ? (
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span>{selectedCompany.name}</span>
                        </div>
                    ) : (
                        "Search company..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search company..." />
                    <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                            {companies.map((company) => (
                                <CommandItem
                                    key={company.id}
                                    onSelect={() => onSelect(company)}
                                    className="flex items-center gap-2 p-3"
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"}`}
                                    />
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{company.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
})

export default CompanySelector;