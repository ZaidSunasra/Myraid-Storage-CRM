import { useUser } from "@/context/UserContext";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Download, Eye, FileText, Notebook, Trash, User } from "lucide-react";
import { useState } from "react";
import { type Assignee, type Drawing, type drawing_status } from "zs-crm-common";
import RejectDrawingDialog from "./RejectDrawingDialog";
import DivLoader from "@/shared/components/loaders/DivLoader";
import ErrorDisplay from "@/shared/components/ErrorPage";
import { usePermissions } from "@/context/PermissionContext";
import { useParams } from "react-router";
import { FetchDrawings } from "@/api/uploads/upload.queries";
import { useApproveDrawing, useDeleteDrawing, useShowDrawingInOrder, useViewDrawing } from "@/api/uploads/upload.mutation";

const DrawingList = ({ context }: { context: "deal" | "order" }) => {

    const { id, order_id } = useParams()
    const [dialog, setDialog] = useState<{ open: boolean; data: number | null; action: "approve" | "disapprove" | null }>({ open: false, data: null, action: null });
    const { data, isPending, isError } = FetchDrawings(context === "deal" ? id as string : order_id as string, context);
    const { user } = useUser();
    const { canView } = usePermissions()
    const viewDrawing = useViewDrawing();
    const deleteDrawing = useDeleteDrawing();
    const approveDrawing = useApproveDrawing();
    const showDrawingInOrder = useShowDrawingInOrder();

    const handleView = async (id: string): Promise<void> => {
        const { viewUrl } = await viewDrawing.mutateAsync(id);
        if (viewUrl) {
            window.open(viewUrl, "_blank");
        } else {
            console.error("View URL not found");
        };
    }

    const handleShowInOrder = (id: string) => {
        showDrawingInOrder.mutate(id)
    }

    const handleDelete = (id: string) => {
        deleteDrawing.mutate(id);
    }

    const handleApprove = () => {
        approveDrawing.mutate(String(dialog.data));
        setDialog({ open: false, data: null, action: null })
    }

    if (isPending) return <DivLoader height={64} showHeading={false} />
    if (isError) return <ErrorDisplay message="Failed to load data. Refresh or please try again later" />

    return <>
        <Card className="shadow-lg bg-background">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Uploaded Drawings</span>
                    <Badge variant="secondary">
                        {data?.totalDrawing} files
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {(Object.entries(data?.drawings ?? {}) as [drawing_status, (Assignee & Drawing)[]][]).map(([status, drawings]) =>
                    drawings.length > 0 ? (
                        <div key={status} className="space-y-1">
                            <h2 className="text-sm font-bold capitalize">{status}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {drawings.map((drawing: (Drawing & Assignee)) => (
                                    <Card
                                        key={drawing.id}
                                        className="hover:shadow-lg transition-all duration-200 bg-background border hover:bg-accent p-0"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="p-2 rounded-lg">
                                                    <FileText className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-foreground">
                                                        {drawing.title}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Badge variant="outline" className="text-xs bg-white/50">
                                                            Version: {drawing.version}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            {drawing.status === "rejected" && (
                                                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2">
                                                    <Notebook className="h-4 w-4 text-red-600" />
                                                    <span className="text-sm text-red-700 font-medium">
                                                        {drawing.note}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3 text-xs text-primary rounded-lg p-2">
                                                <div className="flex items-center space-x-1">
                                                    <FileText className="h-3 w-3" />
                                                    <span>{drawing.file_type}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Download className="h-3 w-3" />
                                                    <span>{Math.ceil(drawing.file_size / 1024)} KB</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {format(new Date(drawing.uploaded_at), "dd/MM/yyyy a")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span>
                                                        {drawing.user.first_name} {drawing.user.last_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1 uppercase">
                                                    <FileText className="h-3 w-3" />
                                                    <span className="font-extrabold">{drawing.upload_type}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 flex-1"
                                                    onClick={() => handleView(String(drawing.id))}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" /> Preview
                                                </Button>
                                                {drawing.status === "pending" && user?.department && canView(user?.department, "approve_drawing") && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700 flex-1"
                                                            onClick={() => setDialog({ open: true, action: "approve", data: drawing.id })}
                                                        >
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-700 flex-1"
                                                            onClick={() => setDialog({ data: drawing.id, action: "disapprove", open: true })}
                                                        >
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Disapprove
                                                        </Button>
                                                    </>
                                                )}
                                                {drawing.status === "rejected" && <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-700 flex-1"
                                                    onClick={() => handleDelete(String(drawing.id))}
                                                >
                                                    <Trash className="h-3 w-3 mr-1" />
                                                    Delete
                                                </Button>
                                                }
                                                {drawing.status === "approved" && drawing.upload_type === "drawing" && drawing.show_in_order === false && context === "deal" &&
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 flex-1"
                                                        onClick={() => handleShowInOrder(String(drawing.id))}
                                                    >
                                                        Show in order
                                                    </Button>
                                                }
                                                {drawing.status === "approved" && drawing.upload_type === "drawing" && drawing.show_in_order === true && context === "deal" &&
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-700 flex-1"
                                                        onClick={() => handleShowInOrder(String(drawing.id))}
                                                    >
                                                        Don't show in order
                                                    </Button>
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : null
                )}
                {data?.totalDrawing === 0 && (
                    <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No drawings uploaded yet</h3>
                    </div>
                )}
            </CardContent>
        </Card>
        <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {dialog.action == "approve" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Approve Drawing</DialogTitle>
                            <DialogDescription>Are you sure you want to approve? This cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" onClick={() => handleApprove()}>
                                Approve
                            </Button>
                        </DialogFooter>
                    </>
                ) : dialog.action === "disapprove" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Reject Drawing</DialogTitle>
                            <DialogDescription>Are you sure you want to reject drawing</DialogDescription>
                        </DialogHeader>
                        <RejectDrawingDialog dialog={setDialog} id={String(dialog.data)} />
                    </>
                ) : (
                    <></>
                )}
            </DialogContent>
        </Dialog>
    </>
}

export default DrawingList