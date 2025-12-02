import { FetchAllDrawings } from '@/api/uploads/upload.queries'
import { Trash2, FileText, Layers, DownloadCloud } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator"
import SearchFilterBar from '@/shared/components/SearchFilter'
import useQueryParams from '@/hooks/useQueryParams'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import PaginationControls from '@/shared/components/PaginationControl'
import { toTitleCase } from '@/utils/formatData'
import { useDeleteDrawing, useViewDrawing } from '@/api/uploads/upload.mutation'
import DivLoader from '@/shared/components/loaders/DivLoader'
import ErrorDisplay from '@/shared/components/ErrorPage'
import { useUser } from '@/context/UserContext'
import { usePermissions } from '@/context/PermissionContext'
import { DRAWING_TYPE_COLORS } from '@/utils/customStyle'
import { calculateTotalStorage } from '../config/drawingUtils'

const DrawingSettings = () => {

    const { rows, page, search, setSearch, setSearchParams } = useQueryParams();
    const viewDrawing = useViewDrawing();
    const deleteDrawing = useDeleteDrawing();
    const { user } = useUser();
    const { canView } = usePermissions();
    const [searchInput, setSearchInput] = useState(search);
    const [dialog, setDialog] = useState<{ open: boolean; data: number | null }>({ open: false, data: null, });
    const debouncedSearch = useDebounce(searchInput, 500);
    const { data, isPending, isError } = FetchAllDrawings({ rows, page, search });
    const lastPage = Math.ceil((data?.totalDrawing || 0) / rows) == 0 ? 1 : Math.ceil((data?.totalDrawing || 0) / rows);

    const handleView = async (id: string): Promise<void> => {
        const { viewUrl } = await viewDrawing.mutateAsync(id);
        if (viewUrl) {
            window.open(viewUrl, "_blank");
        } else {
            console.error("View URL not found");
        };
    }

    const handleDelete = (id: string) => {
        deleteDrawing.mutate(id, {
            onSuccess: () => setDialog({ open: false, data: null })
        });
    }

    useEffect(() => {
        setSearch(debouncedSearch, search);
    }, [debouncedSearch, search, setSearchParams]);

    if (isPending) return <DivLoader height={64} showHeading={true} />
    if (isError) return <ErrorDisplay message="Failed to load data" />

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Drawings</h2>
                <p className="text-muted-foreground">Manage and organize all your uploaded drawings and documents</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Drawings</CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{data.totalDrawing}</div>
                        <p className="text-xs text-gray-500 mt-1">All files</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
                        <Layers className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{calculateTotalStorage(data.drawings)}</div>
                        <p className="text-xs text-gray-500 mt-1">Combined size</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <SearchFilterBar searchInput={searchInput} setSearchInput={setSearchInput} showEmployee={false} />
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Type</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Size</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Deal ID</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Order ID</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Upload Date</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Version</TableHead>
                                    <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.drawings.map((drawing) => (
                                    <TableRow key={drawing.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{toTitleCase(drawing.title)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${DRAWING_TYPE_COLORS[drawing.upload_type as keyof typeof DRAWING_TYPE_COLORS]}`}
                                            >
                                                {drawing.upload_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-700">{drawing.file_size}</TableCell>
                                        <TableCell>
                                            {drawing.deal_id}
                                        </TableCell>
                                        <TableCell>
                                            {drawing.order_id}
                                        </TableCell>
                                        <TableCell className="text-gray-700">
                                            {new Date(drawing.uploaded_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {drawing.version}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-around">
                                                <Button
                                                    type="button"
                                                    onClick={() => handleView(String(drawing.id))}
                                                    className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
                                                >
                                                    <DownloadCloud className="w-5 h-5" />
                                                </Button>
                                                {user?.department && canView(user.department, "delete_drawing") &&
                                                    <Button
                                                        type="button"
                                                        onClick={() => setDialog({ data: drawing.id, open: true })}
                                                        className="p-2 rounded-md bg-destructive hover:bg-destructive/90 text-white transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {data.drawings.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No drawings found</h3>
                            <p className="text-gray-500 mb-6">
                                {searchInput !== ""
                                    ? "Try adjusting your search or filter criteria"
                                    : "Get started by uploading your first drawing"}
                            </p>
                        </div>
                    )}
                </CardContent>
                <PaginationControls lastPage={lastPage} />
            </Card>
            <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Drawing</DialogTitle>
                        <DialogDescription>Are you sure you want to delete? This cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" onClick={() => handleDelete(String(dialog.data))}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DrawingSettings