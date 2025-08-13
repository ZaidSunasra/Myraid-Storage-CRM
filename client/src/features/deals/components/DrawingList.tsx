import { FetchDrawings } from "@/api/deals/deal.queries"
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format } from "date-fns";
import { Calendar, Download,  Eye, FileText, User } from "lucide-react";

const DrawingList = ({ id }: { id: string }) => {

    const { data, isPending } = FetchDrawings(id);

    if (isPending) return <>Loading</>

    console.log(data);

    return <Card className="shadow-lg bg-background">
        <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>Uploaded Drawings</span>
                    <Badge variant="secondary">
                        {data.drawings.length} files
                    </Badge>
                </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.drawings.map((drawing: any) => (
                    <Card
                        key={drawing.id}
                        className="hover:shadow-lg transition-all duration-200 bg-background  border hover:bg-accent p-0"
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
                                                   Version: {}
                                                    {drawing.version}
                                                </Badge>
                                            </div>
                                        </div>
                                </div>
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
                                        <span>{format(drawing.uploaded_at, "dd/MM/yyyy a")}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <User className="h-3 w-3" />
                                        <span>{drawing.user.first_name} {drawing.user.last_name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 flex-1"
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs bg-white/50 hover:bg-white/70 flex-1"
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                    </Button>
                                </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {data.drawings.length === 0 && (
                <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No drawings uploaded yet</h3>
                </div>
            )}
        </CardContent>
    </Card>
}

export default DrawingList