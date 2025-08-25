import { useState, useCallback } from "react"
import { Separator } from "@/shared/components/ui/separator"
import { FetchCompanies, FetchCompanyEmployee } from "@/api/company/company.queries"
import { type Client_Details, type Company } from "zs-crm-common"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Building2, Plus } from "lucide-react"
import CompanySelector from "../components/CompanySelector"
import EmployeeSelector from "../components/EmployeeSelector"
import EditCompanyDetails from "../components/EditCompanyDetails"
import EditClientDetails from "../components/EditClientDetails"
import { Button } from "@/shared/components/ui/button"

const CompanySettings = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Client_Details | null>(null)

  const { data: companyData, isPending: companyPending } = FetchCompanies("")
  const { data: employeeData, isPending: employeePending } = FetchCompanyEmployee(selectedCompany?.id || 0)

  const handleCompanySelect = useCallback((company: Company) => {
    setSelectedCompany(company)
    setSelectedEmployee(null);
  }, [])

  const handleEmployeeSelect = useCallback((emp: Client_Details) => {
    setSelectedEmployee(emp)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Company & Client Settings</h2>
        <p className="text-muted-foreground">Manage company information and details.</p>
      </div>
      <Separator />
      <Card className="border-0 shadow-lg bg-background">
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Client & Company Information
          </CardTitle>
          {selectedCompany &&
            <Button onClick={() => setSelectedEmployee({company_id: selectedCompany.id, id: 0, first_name: "", last_name: "", emails: [], phones: [{phone: ""}]})}>
              <Plus className="h-5 w-5" />
              Add Client
            </Button>
          }
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CompanySelector
              companies={companyData?.companies || []}
              selectedCompany={selectedCompany}
              onSelect={handleCompanySelect}
              isLoading={companyPending}
            />
            {selectedCompany && (
              <EmployeeSelector
                employees={employeeData?.employees || []}
                selectedEmployee={selectedEmployee}
                onSelect={handleEmployeeSelect}
                isLoading={employeePending}
              />
            )}
          </div>

        </CardContent>
      </Card>
      {selectedCompany && <EditCompanyDetails key={`company-${selectedCompany.id}`} company={selectedCompany} setSelectedCompany={setSelectedCompany}/>}
      {selectedEmployee && <EditClientDetails key={`employee-${selectedEmployee.id}`} employee={selectedEmployee} setSelectedEmployee={setSelectedEmployee}/>}
    </div>
  )
}

export default CompanySettings
