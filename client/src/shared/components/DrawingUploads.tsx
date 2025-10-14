import { useUploadDrawing, useUploadUrl } from "@/api/uploads/upload.mutation";
import { usePermissions } from "@/context/PermissionContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form"
import { useParams } from "react-router";
import { uploadDrawingFormSchema, type upload_type, type UploadDrawingForm } from "zs-crm-common";

const DrawingUploads = ({ context }: { context: "deal" | "order" }) => {

    const uploadURL = useUploadUrl();
    const uploadDrawing = useUploadDrawing();
    const { id, order_id } = useParams();
    const { user } = useUser();
    const { canView } = usePermissions();
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm<UploadDrawingForm>({
        resolver: zodResolver(uploadDrawingFormSchema),
        defaultValues: ({
            title: "",
            version: "A",
            file: null,
            upload_type: context === "deal" ? "drawing" : undefined
        })
    });

    const handleReset = () => {
        form.reset();
        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    const handleUploadDrawing = async (data: UploadDrawingForm) => {

        const uploadUrlResponse = await uploadURL.mutateAsync({
            fileName: data.file?.name as string,
            fileType: data.file?.type as string,
            upload_type: context === "order" ? data.upload_type : "drawing",
        })

        await axios.put(uploadUrlResponse.uploadUrl, data.file, {
            headers: {
                "Content-Type": data.file?.type
            }
        });

        await uploadDrawing.mutateAsync({
            drawing_url: uploadUrlResponse.fileKey,
            title: data.title,
            version: context === "deal" ? data.version : "A",
            deal_id: id as string,
            order_id: context === "order" ? order_id as string : "",
            file_size: data.file?.size as number,
            file_type: data.file?.type as string,
            upload_type: context === "order" ? data.upload_type : "drawing",
            context: context
        });

        handleReset();
    }

    const allowedUploads: { key: upload_type; label: string }[] = [];

    if (user?.department && canView(user.department, "upload_pi"))
        allowedUploads.push({ key: "pi", label: "PI" });
    if (user?.department && canView(user.department, "upload_po"))
        allowedUploads.push({ key: "po", label: "PO" });
    if (user?.department && canView(user.department, "upload_general"))
        allowedUploads.push({ key: "general", label: "General" });


    return <Form {...form}>
        <Card className=" backdrop-blur-sm border-0 shadow-lg bg-background">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span>Upload New Drawing</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={form.handleSubmit(handleUploadDrawing, (errors) => console.log(errors))}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel>Drawing Title*</FormLabel>
                                            <FormControl>
                                                <Input id="drawing-title" placeholder="Enter drawing title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            {context === "deal" ?
                                <FormField
                                    control={form.control}
                                    name="version"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Version*</FormLabel>
                                            <Select onValueChange={field.onChange}
                                                value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select version" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "t", "U", "V", "W", "X", "Y", "Z"].map((val) => (
                                                        <SelectItem key={val} value={val}>{val}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> :
                                <FormField
                                    control={form.control}
                                    name="upload_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload Type*</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select upload document type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {allowedUploads.map(({ key, label }) => (
                                                        <SelectItem key={key} value={key}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            }
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            File Upload*
                        </Label>
                        <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center bg-white/30 hover:bg-white/40 transition-colors">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-4 bg-blue-100 rounded-full">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-foreground">
                                        Drop your files here or click to browse
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Supports PDF, DWG files up to 50MB
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="space-y-2">
                                                <FormControl>
                                                    <Input
                                                        ref={fileRef}
                                                        type="file"
                                                        onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center space-x-3">
                            <Button type="button" variant="outline" className="bg-white/50" onClick={() => handleReset()}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                disabled={uploadDrawing.isPending}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Drawing
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    </Form>
}

export default DrawingUploads