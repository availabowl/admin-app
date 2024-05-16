import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import { EllipsisTableRowElem } from "../EllipsisTableRowElem/EllipsisTableRowElem";
import { Vendor } from "@/types/db_interfaces"
import { DraftLabel } from "../DraftLabel";

interface VendorElementProps {
    /** Vendor data record that the element will be displaying. */
    vendor: Vendor,
    /** Function that allows the administrator to delete a vendor. */
    onDelete: () => Promise<Boolean>
};

const VendorElement = ({vendor, onDelete} : VendorElementProps) => {
    const [showLoading, setShowLoading] = useState(false);

    const handleOnDelete = () => {
        setShowLoading(true);
        onDelete().then(res => {
            if (res) setShowLoading(false);
        })
    }

    return (
        <>
        <th scope="row" className="flex items-center gap-5 text-left p-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {
                vendor!.vendoricon === 'test' || vendor!.vendoricon === '' ?
                <div className="w-[40px] h-[40px] rounded-full bg-slate-800">
                </div>
                :
                <Image src={process.env.NEXT_PUBLIC_S3_URL + vendor!.vendoricon} width={40} height={40} alt={`${vendor!.vendorname} icon`} className="rounded-full" />
            }
            <Link href={`/dashboard/schools/${vendor.schoolid}/${vendor.dhid}/${vendor.id}`} className="font-bold flex items-center gap-2">
                {vendor.vendorname}
            </Link>
            {
                vendor.isdraft && <DraftLabel />
            }
        </th>
        <td className="p-6">
            <span className="flex items-center gap-1">{Math.round(Number(vendor.averagerating) * 100) / 100}<FaStar />({vendor.numreviews})</span>
        </td>
        <td className="p-6">
            <p>{vendor.vendorcategory}</p>
        </td>
        <EllipsisTableRowElem
        showLoading={showLoading}
        onDelete={handleOnDelete}
        addButtonUrl={`/dashboard/schools/${vendor.schoolid}/${vendor.dhid}/${vendor.id}`}
        />
        </>
    )

};

export { VendorElement };