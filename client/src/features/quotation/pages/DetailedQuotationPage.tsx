import { FetchQuotationById } from "@/api/quotations/quotation.queries";
import { useUser } from "@/context/UserContext";
import ErrorDisplay from "@/shared/components/ErrorPage";
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toTitleCase } from "@/utils/formatData";
import { ArrowLeft, Copy, Edit, FileText, Trash2 } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router"
import QuotationDetails from "../component/QuotationDetails";
import QuotationWorkingDetails from "../component/QuotationWorkingDetails";
import { DEPARTMENTS, type GetQuotationOutput } from "zs-crm-common";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { useState } from "react";
import CopyQuotationForm from "../component/CopyQuotationForm";
import { useDeleteQuotation } from "@/api/quotations/quotations.mutation";
import { usePermissions } from "@/context/PermissionContext";

const DetailedQuotationPage = () => {

    const { id, quotation_id } = useParams();
    const [dialog, setDialog] = useState<{ open: boolean; action: "copy" | "delete" | null }>({ open: false, action: null });
    const { data, isError, isPending } = FetchQuotationById(quotation_id as string);
    const { user } = useUser();
    const { canView } = usePermissions();
    const navigate = useNavigate();
    const deleteQuotation = useDeleteQuotation();

    const onSubmit = () => {
        console.log(quotation_id);
        deleteQuotation.mutate(quotation_id as string)
    }

    if (isPending) return <DetailedPageLoader />
    if (isError) return <ErrorDisplay fullPage />

    return <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-0 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 p-2 sm:p-0 gap-4">
                    <div className="flex items-center">
                        <NavLink to={`/quotation`}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </NavLink>
                        <div>
                            <h1 className="text-2xl font-bold ">
                                {data.quotation?.quotation_no}
                            </h1>
                            <p className="text-gray-600">{toTitleCase(data.quotation?.deal.company.name as string)}</p>
                        </div>
                    </div>
                    {user?.department && canView(user?.department, "add_quotation") && <>
                        {(data.quotation?.created_by == user.id || user.department === DEPARTMENTS[1]) &&
                            <Button onClick={() => navigate(`/quotation/edit/${id}/${quotation_id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Quotation
                        </Button>}
                    </>

                    }
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-4">
                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 bg-background">
                            <TabsTrigger value="info">
                                Quotation Information
                            </TabsTrigger>
                            {user?.department && canView(user?.department, "view_quotation_preview_details") &&
                                <TabsTrigger value="working">
                                    Quotation Working
                                </TabsTrigger>
                            }
                        </TabsList>
                        <TabsContent value="info" className="space-y-6">
                            <QuotationDetails data={data.quotation as GetQuotationOutput} />
                        </TabsContent>
                        <TabsContent value="working" className="space-y-6">
                            <QuotationWorkingDetails data={data.quotation as GetQuotationOutput} />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="lg:col-span-1">
                    <div className="w-full mb-8">
                        <Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full" onClick={() => navigate(`/deal/${id}`)} >
                            <ArrowLeft className="w-4 h-4" />
                            Deal Page
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {user?.department && canView(user.department, "copy_quotation") &&
                            <div className="w-full">
                                <Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => setDialog({ open: true, action: "copy" })}
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Quotation
                                </Button>
                            </div>
                        }
                        {user?.department && canView(user.department, "view_quotation") && <div className="w-full">
                            <Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => window.open(`/quotation/print/${id}/${quotation_id}`, "_blank")}
                            >
                                <FileText className="w-4 h-4" />
                                View Quotation
                            </Button>
                        </div>}
                        {user?.department && canView(user?.department, "delete_quotation") &&
                            <div className="w-full">
                                <Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full hover:bg-red-700" variant="destructive"
                                    onClick={() => setDialog({ open: true, action: "delete" })}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Quotation
                                </Button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { action: null }) }))}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {dialog.action === "copy" ? (
                    <DialogHeader>
                        <DialogTitle>Copy Quotation</DialogTitle>
                        <DialogDescription>
                            Enter the Deal ID where you want to copy this quotation.
                        </DialogDescription>
                        <CopyQuotationForm />
                    </DialogHeader>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Delete Quotation</DialogTitle>
                            <DialogDescription>Are you sure you want to delete? This cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" onClick={() => onSubmit()}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    </div>
}

export default DetailedQuotationPage