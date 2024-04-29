import React, { RefObject, useState, useRef, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { IoAddCircleOutline, IoEllipsisHorizontalSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";

import { FormSubmitResponse } from "@/types/db_interfaces";
import { ModifyTableRowElementProps } from "../EllipsisTableRowElem/interfaces";

interface EllipsisParentElemProps {
    /** Boolean that indicates when the DELETE request is called. */
    showLoading: boolean,
    /** Delete function that is fired to delete the parent record (school or dining hall).  */
    onDelete: (e: Event) => Promise<void>,
    /** Response object that indicates if the deletion was successful or failed. */
    response: FormSubmitResponse | null
};

const EllipsisParentElem = ({showLoading, onDelete, response} : EllipsisParentElemProps) => {
    const [showModify, setShowModify] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null); // Ref element used for the general menu element.
    const parentEllipsisRef = useRef<HTMLDivElement>(null); // Ref element used for the "ellipsis"/see more button.
    const parentDeleteRef = useRef<HTMLDivElement>(null); // Ref elemeent used for the delet menu element.

    const handleOnHide = () => {
        setShowModify(false);
        setShowDelete(false);
    };

    const handleShowDelete = () => {
        setShowDelete(true);
        setShowModify(false);
    };

    // Event listener that handles opening/closing the tab element menu based on where the cursor is clicked on the page
    function useOutsideAlerter(ref: any, ellipsisRef: any, deleteRef: any) {
        useEffect(() => {
            function handleClickOutside(event: Event) {
                if (ellipsisRef.current && ellipsisRef.current.contains(event.target) && showModify) {
                    setShowModify(false);
                } else if (ref.current && !ref.current.contains(event.target) && ellipsisRef.current && !ellipsisRef.current.contains(event.target)) {
                    setShowModify(false);
                } else if (ellipsisRef.current && deleteRef.current && !ellipsisRef.current.contains(event.target) && !deleteRef.current.contains(event.target)) {
                    setShowModify(false);
                    setShowDelete(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref, deleteRef, ellipsisRef]);
    };

    useOutsideAlerter(parentRef, parentEllipsisRef, parentDeleteRef);

    return (
        <div className="relative">
            <button onClick={() => setShowModify(!showModify)}>
                <div ref={parentEllipsisRef}>
                    <IoEllipsisHorizontalSharp size={20} />
                </div>
            </button>
            <ModifyParentElement showModify={showModify}
            showModifyRef={parentRef} setShowDelete={handleShowDelete} />
            <DeleteParentElement showDelete={showDelete} showLoading={showLoading} onHide={handleOnHide}
            deleteRef={parentDeleteRef} response={response!}
            onDelete={onDelete} />
        </div>
    )
};

const ModifyParentElement = ({showModify, showModifyRef, setShowDelete} : ModifyTableRowElementProps) => {
    const pathname = usePathname();

    return (
        showModify &&
        <div className="border border-slate-700 rounded absolute top-[25px] right-[0px] bg-slate-800 z-10 w-[175px] shadow" ref={showModifyRef}>
            <ul className="divide-y divide-slate-700">
                <li>
                    <Link href={`${pathname}/edit`}
                    className="py-3 px-4 font-bold flex items-center justify-between gap-3"
                    >
                        <span>Edit</span><FaRegEdit size={18} />
                    </Link>
                </li>
                <li>
                    <button onClick={setShowDelete} className="w-full py-3 px-4 font-bold text-red-600 flex items-center justify-between gap-2">
                        <span>Delete</span><MdDeleteOutline size={20} />
                    </button>
                </li>
                <li>
                    <Link href={`${pathname}/add`} className="py-3 px-4 font-bold flex items-center justify-between gap-2">
                        <span>Add</span><IoAddCircleOutline size={20} />
                    </Link>
                </li>
            </ul>
        </div>
    )
};

type DeleteParentElementProps = {
    showDelete: boolean,
    showLoading: boolean,
    onHide: () => any,
    onDelete: (e: any) => Promise<void>,
    deleteRef: RefObject<HTMLDivElement>,
    response: FormSubmitResponse
};

const DeleteParentElement = ({showDelete, showLoading, onHide, onDelete, deleteRef, response} : DeleteParentElementProps) => {    
    return (
        showDelete &&
        <div className="flex items-center justify-center w-full h-full p-4 text-gray-500 shadow dark:text-gray-400 dark:bg-black/[.6] z-50 fixed top-0 left-0">
            <div className="relative bg-slate-700 w-[500px] rounded" ref={deleteRef}>
                <div className="p-6 border-b border-slate-500">
                    <h1 className="text-2xl font-bold text-white">Delete</h1>
                </div>
                <div className="p-6">
                    <p className="font-semibold mb-2">Are you sure? You cannot undo this action.</p>
                    <p>Warning: after confirming, you will be deleting from the master database. These actions will replicate among all other scaled databases.</p>
                    <div className="w-full flex items-center justify-between grow gap-2 mt-8">
                        <button className="bg-red-800 px-8 py-3 flex items-center text-center justify-center rounded w-[50%] text-white font-semibold"
                        onClick={onDelete}
                        disabled={showLoading}>
                            {
                                showLoading
                                ?
                                <div role="status">
                                    <svg aria-hidden="true" className="w-5 h-5 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                : <span>Delete</span>
                            }
                        </button>
                        <button className="bg-gray-300 text-black px-8 py-3 flex items-center text-center justify-center rounded w-[50%] font-semibold"
                        onClick={onHide}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export { EllipsisParentElem };