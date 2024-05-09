import { useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import { EllipsisTableRowElem } from "../EllipsisTableRowElem/EllipsisTableRowElem";
import { Dh } from "@/types/db_interfaces";
import { DraftLabel } from "../DraftLabel";
import { ArchivedLabel } from "../ArchivedLabel";

interface DhProps {
    /** Dining hall data record that the element will be displaying. */
    dh: Dh,
    /** Function that allows the administrator to delete a dining hall. */
    onDelete: () => Promise<Boolean>;
    pathname: string;
};

const DhElement = ({dh, onDelete, pathname} : DhProps) => {
    const [showLoading, setShowLoading] = useState(false);

    const handleDelete = async () => {
        setShowLoading(true);
        onDelete().then(res => {
            if (res) setShowLoading(false);
        })
    };

    return (
        <>
        <th scope="row" className="flex items-center gap-4 text-left p-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <Link href={`/dashboard/schools/${dh.schoolid}/${dh.id}`} className="font-bold">{dh.dhname}</Link>
            {
                dh.isdraft && <DraftLabel />
            }
            {
                dh.is_archived && <ArchivedLabel />
            }
        </th>
        <td className="p-6">
            <span className="flex items-center gap-1">{Math.round(Number(dh.averagerating) * 100) / 100}<FaStar />({dh.numreviews})</span>
        </td>
        <td className="p-6">
            <p>{dh.num_vendors}</p>
        </td>
        <EllipsisTableRowElem
        showLoading={showLoading}
        onDelete={handleDelete}
        addButton
        addButtonUrl={pathname}
        />
        </>
    )
};

export { DhElement };