import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import { School } from "@/types/db_interfaces";
import { EllipsisTableRowElem } from "../EllipsisTableRowElem/EllipsisTableRowElem";
import { DraftLabel } from "../DraftLabel";

type SchoolElementProps = {
    /** School data record that the element will be displaying. */
    school: School,
    /** Optional function that allows the administrator to delete a school. */
    deleteSchool?: () => Promise<Boolean>;
};

const SchoolElement = ({school, deleteSchool} : SchoolElementProps) => {
    const [showLoading, setShowLoading] = useState(false);

    const handleDelete = async () => {
        setShowLoading(true);
        deleteSchool!().then(res => {
            if (res) setShowLoading(false);
        })
    };

    return (
        <>
        <th scope="row" className="flex items-center gap-4 text-left p-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {
                school.schoolphoto 
                ? <Image src={process.env.NEXT_PUBLIC_S3_URL + school.schoolphoto} className="rounded-full" width={40} height={40} alt={`${school.schoolname} icon`} />
                : <div className="w-[40px] h-[40px] rounded-full bg-slate-800"></div>
            }
            <Link href={`/dashboard/schools/${school.id}`} className="font-bold">{school.schoolname}</Link>
            {
                school.isdraft && <DraftLabel />
            }
        </th>
        <td className="p-6">
            <span className="flex items-center gap-1">{Math.round(Number(school.averagerating) * 100) / 100}<FaStar />({school.numreviews})</span>
        </td>
        <td className="p-6">
            <span className="flex items-center gap-1">{school.num_dhs}</span>
        </td>
        <td className="p-6">
            <p>{school.schoolstate}</p>
        </td>
        {
            deleteSchool &&
            <EllipsisTableRowElem
            showLoading={showLoading}
            onDelete={handleDelete}
            addButtonUrl={`/dashboard/schools/${school.id}`}
            addButton />
        }
        </>
    )
};

export { SchoolElement };