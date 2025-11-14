import { type Dispatch, type SetStateAction } from "react"
import Logo from "@/assets/logo.png"
import { format } from "date-fns"
import { capitalize } from "@/utils/formatData"
import { Input } from "@/shared/components/ui/input"
import type { GetQuotationOutput } from "zs-crm-common"

const Heading = ({ quotation, name, setName }: { quotation: GetQuotationOutput, name: string[], setName: Dispatch<SetStateAction<string[]>> }) => {

    return (
        <div>
            <div className="flex mb-4 gap-4 items-center">
                <div>
                    <img src={Logo} alt="logo" className="w-full" />
                </div>
                <div className="text-md font-medium">
                    <p> A/702, Al Husain Bldg, Momin Nagar, Jogeshwari (W), Mumbai 400102 </p>
                    <p>State  :  Maharashtra, Code : 27</p>
                    <p>Contact: 9769370343 </p>
                    <p>GST No: 27ABJFM1234A1Z5</p>
                    <p>info@myriadstoragesystem.com</p>
                    <p>sales@myriadstoragesystem.com</p>
                    <p>www.myriadstoragesystem.com</p>
                </div>
            </div>
            <hr />
            <p>Factory Address: Gala No 5, Vakan Compound, Near Dynamic Co, Vakan Pada Raod, Vasai Phata, Vasai East, Dis. Palghar 401208. </p>
            <hr />
            <div className="mb-6 font-bold">
                <p>Quotation No: {quotation.quotation_no}</p>
                {quotation.quotation_products.length == 1 &&
                    <>
                        <Input
                            className="print:hidden"
                            value={name[0] ?? ""}
                            onChange={(e) =>
                                setName((prev) =>
                                    prev.map((val, i) => (i === 0 ? e.target.value : val))
                                )
                            }
                        />
                        {name[0] !== "" && <p> {name[0]} </p>}
                    </>
                }
                <div className=" text-sm leading-relaxed tracking-wide text-gray-800 print:text-black">
                    <p className="font-semibold text-gray-900">
                        Date: <span className="font-bold">{format(quotation.created_at, "dd-MM-yyyy")}</span>
                    </p>
                    <p className="text-lg font-bold text-gray-900 underline underline-offset-4">
                        Buyer
                    </p>
                    <p className="uppercase font-semibold text-base tracking-wider">
                        {quotation.deal.company.name}
                    </p>
                    <p className="w-2/5 break-words text-gray-700 leading-snug">
                        {quotation.deal.company.address
                            ? quotation.deal.company.address
                            : "Address not provided"}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-semibold">GST:</span>{" "}
                        {quotation.deal.company.gst_no
                            ? quotation.deal.company.gst_no
                            : "No GST provided"}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-semibold">Email:</span>{" "}
                        {quotation.deal.client_detail.emails.length > 0
                            ? quotation.deal.client_detail.emails[0].email
                            : ""}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-semibold">Phone:</span>{" "}
                        {quotation.deal.client_detail.phones[0]?.phone}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-semibold">Kind Attn:</span>{" "}
                        Mr.{" "}
                        {capitalize(quotation.deal.client_detail.first_name)}{" "}
                        {capitalize(quotation.deal.client_detail.last_name)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Heading