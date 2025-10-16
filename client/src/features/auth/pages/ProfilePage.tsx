import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { BriefcaseBusiness, FileText, Mail, Phone } from "lucide-react"
import { useUser } from "@/context/UserContext"
import Navbar from "@/shared/components/Navbar"
import { useState } from "react"
import type { EditUser } from "zs-crm-common"
import { FetchUserDetail } from "@/api/auth/auth.queries"
import DivLoader from "@/shared/components/loaders/DivLoader"
import ErrorDisplay from "@/shared/components/ErrorPage"
import AddUserForm from "@/features/settings/components/AddUserForm"
import { capitalize } from "@/utils/formatData"
import { Dialog,  DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import ChangePasswordForm from "../components/ChangePassword"



const ProfilePage = () => {

    const { user } = useUser();

    const [userData, setUserData] = useState<{ id: number | null, type: "edit" | null }>({ id: null, type: null })
    const [dialog, setDialog] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<EditUser | null>(null);
    const { data, isPending, isError } = FetchUserDetail();

    const handleReset = () => {
        setSelectedUser(null);
        setUserData({ id: null, type: null })
    }

    if (isPending) return <DivLoader showHeading height={400} />
    if (isError) return <ErrorDisplay />

    console.log(data)

    return (
        <main className="min-h-screen bg-accent">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 border border-primary">
                            <AvatarFallback>
                                {user?.name[0]}
                                {user?.name.split(" ")[1][0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
                            </div>
                            <p className="text-sm text-muted-foreground">{user?.department}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setDialog(true)}>Change Password</Button>
                        <Button variant="outline" onClick={() => {
                            setSelectedUser(null);
                            setSelectedUser(data.detail as EditUser);
                            setUserData({ id: data.detail?.id as number, type: "edit" })
                        }}>Edit Profile</Button>
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>How your team can reach you</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-md border p-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Name</div>
                                    <div className="font-medium">{data.detail?.first_name} {data.detail?.last_name}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-md border p-2">
                                    <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Department</div>
                                    <div className="font-medium">{capitalize(data.detail?.department as string)}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-md border p-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Quotation Code</div>
                                    <div className="font-medium">{data.detail?.quotation_code ? data.detail.quotation_code : "No code provided"}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-md border p-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Email</div>
                                    <div className="font-medium">{data.detail?.email}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-md border p-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Phone</div>
                                    <div className="font-medium">{data.detail?.phone}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {selectedUser && <AddUserForm key={`user-${userData.id}`} userData={selectedUser} info={userData} reset={handleReset} />}
            </div>
            <Dialog open={dialog} onOpenChange={() =>setDialog(false)}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>Please enter the below details to change password</DialogDescription>
                            </DialogHeader>
                            <ChangePasswordForm setDialog={setDialog}/>
                </DialogContent>
            </Dialog>
        </main >
    )
}

export default ProfilePage