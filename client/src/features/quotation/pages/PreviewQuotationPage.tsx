import { useQuotation } from "@/context/QuotationContext"
import type { AddQuotation } from "zs-crm-common";
import PreviewItemTable from "../component/previewLayouts/PreviewItemTable";
import PreviewBodyTable from "../component/previewLayouts/PreviewBodyTable";
import SingleProductCosting from "../component/previewLayouts/SingleProductCosting";
import MultipleProductCosting from "../component/previewLayouts/MultipleProductCosting";
import { useUser } from "@/context/UserContext";
import { usePermissions } from "@/context/PermissionContext";

const PreviewQuotationPage = ({ data }: { data: AddQuotation }) => {

  const { products } = useQuotation();
  const {user} = useUser();
  const {canView} = usePermissions();
  const isDiscountGiven = products.some(
    (product) => (product.discount) > 0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
      <div className="space-y-6 sm:col-span-3">
        <PreviewItemTable isDiscountGiven={isDiscountGiven} data={data} />
        <PreviewBodyTable data={data} />
      </div>
      {user?.department && canView(user.department, "view_quotation_preview_details") && <div className="space-y-6 sm:col-span-3">
        {products.length <= 1 ?
          <SingleProductCosting /> :
          <MultipleProductCosting />
        }
      </div>}
    </div>
  )
}

export default PreviewQuotationPage