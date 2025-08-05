import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form"

const DrawingUploads = () => {

    const form = useForm();

    return <Form {...form}>
        <Card className=" backdrop-blur-sm border-0 shadow-lg bg-background">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span>Upload New Drawing</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
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
                            <FormField
                                control={form.control}
                                name="version"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Version*</FormLabel>
                                        <Select defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select version" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "t", "U", "V", "W", "X", "Y", "Z"].map((val) => (
                                                    <SelectItem value={val}>{val}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        Supports PDF, DWG, DXF, PNG, JPG files up to 50MB
                                    </p>
                                </div>
                                <Input type="file" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center space-x-3">
                            <Button type="button" variant="outline" className="bg-white/50">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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