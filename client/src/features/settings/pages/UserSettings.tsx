import { FetchAllEmployee } from "@/api/employees/employee.queries"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { capitalize } from "@/utils/formatData"
import { Pencil, Plus } from "lucide-react"
import AddUserForm from "../components/AddUserForm"
import { useState } from "react"
import { type AddUser, type EditUser, } from "zs-crm-common"
import DivLoader from "@/shared/components/loaders/DivLoader"
import ErrorDisplay from "@/shared/components/ErrorPage"

const UserSettings = () => {

  const [userData, setUserData] = useState<{ id: number | null, type: "edit" | "add" | null }>({ id: null, type: null })
  const { data, isPending, isError } = FetchAllEmployee();
  const [selectedUser, setSelectedUser] = useState<AddUser | EditUser | null>(null);

  const handleReset = () => {
    setSelectedUser(null);
    setUserData({id: null, type: null})
  }

  if (isPending) return <DivLoader height={64} showHeading={true}/>
 if (isError) return <ErrorDisplay message="Failed to load data"/>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">Manage users</p>
      </div>
      <Separator />
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button className="w-full sm:w-fit"
            onClick={() => {
              setSelectedUser(null);
              setSelectedUser({ first_name: "", last_name: "", email: "", phone: "", quotation_code: "", department: "sales" });
              setUserData({ id: 0, type: "add" })
            }}
          >
            <Plus className="h-5 w-5" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table >
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Quotation Code</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{capitalize(employee.first_name)} {capitalize(employee.last_name)}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{capitalize(employee.department)}</TableCell>
                    <TableCell>{employee.quotation_code ? employee.quotation_code : "No code provided"}</TableCell>
                    <TableCell>
                      <Button variant="outline"
                        onClick={() => {
                          setSelectedUser(employee as EditUser);
                          setUserData({ id: employee.id, type: "edit" })
                        }}
                      >
                        <Pencil className="text-green-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedUser && <AddUserForm key={`user-${userData.id}`} userData={selectedUser} info={userData} reset={handleReset}/>}
    </div>
  )
}

export default UserSettings