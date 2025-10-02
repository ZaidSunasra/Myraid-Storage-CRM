import { Textarea } from '@/shared/components/ui/textarea'
import { useState } from 'react'

const Terms = () => {
    const defaultTerms = `1. Payment :- 50% Advance payment along with the purchase order, 50% payment before material dispatching.\n2. Delivery :- Order of material delivery within 4 to 5 weeks from the date of receipt of this P.O.\n3. Unloading Material :- At your scope (any mathadi union unloading issue to be managed by buyer & it will not be our responsibility).\n4. Packing Charges :- No extra charges for packing of material.\n5. Colour :- RAL 7032 STR, RAL 7035 STR, LIGHT GREY STR, D.A.GREY STR or AVAILABLE SHADES.\n6. Quotation Validity :- 15 days.\n7. Taxes :- Within Maharashtra 9% CGST + 9% SGST / outside Maharashtra 18% IGST Extra to your Account.\n8. Freight Charges :- At your scope.\n9. Installation Charges :- At your end.\n10. Loading and Boarding :- At your scope.\n11. Warranty :- 12 months Warranty against Manufacturing defect.\n12. Annual Maintenance Contract from "MYRIAD" will start after completion of 1 year’s Warranty. Till 1 year, any kind of servicing will be done free to client.\n
    `;
    const [terms, setTerms] = useState(defaultTerms);

    return (
        <div>
            <h3 className="text-lg text-red-600 font-bold">
                Terms and Conditions
            </h3>
            <Textarea
                rows={12}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full resize-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 print:hidden"
            />
            <div className="hidden print:block whitespace-pre-line text-sm text-gray-800">
                {terms}
            </div>
        </div>
    )
}

export default Terms