import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/shared/components/ui/table"
import { Label } from "@/shared/components/ui/label"
import { toTitleCase } from "@/utils/formatData"
import { IndianRupee, LayoutTemplate, Percent, User } from "lucide-react"
import type { GetQuotationOutput } from "zs-crm-common"

const QuotationDetails = ({ data }: { data: GetQuotationOutput }) => {

  return <>
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Quotation Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Quotation No.</Label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>{data.quotation_no}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Grant Total</Label>
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-4 w-4 text-gray-400" />
              <span>{data.grand_total}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>GST (%)</Label>
            <div className="flex items-center space-x-2">
              <Percent className="h-4 w-4 text-gray-400" />
              <span>{data.gst}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <div className="flex items-center space-x-2">
              <LayoutTemplate className="h-4 w-4 text-gray-400" />
              <span>{toTitleCase(data.quotation_template)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    {data.quotation_products.map((product) => (
      <Card className="bg-background shadow-md rounded-2xl" key={product.id}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Item</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Width</TableHead>
                <TableHead>Depth</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.quotation_item.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.item_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.item_code}
                    </div>
                  </TableCell>
                  <TableCell>{item.height}</TableCell>
                  <TableCell>{item.width}</TableCell>
                  <TableCell>{item.depth}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card >
    ))}
  </>
}

export default QuotationDetails