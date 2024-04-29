"use client"
import { useState, useEffect } from "react";
import { Dh, FormSubmitResponse, School } from "@/types/db_interfaces";
import { IoLocationOutline } from "react-icons/io5";
import { TbBuildingStore } from "react-icons/tb";
import { useRouter } from "next/navigation";

import { Toast } from "@/lib/components/Toast/Toast";
import { TableSkeleton } from "@/lib/components/TableSkeleton/TableSkeleton";
import { DhElement } from "@/lib/components/Dh";
import { Header } from "@/lib/components/Header";
import { EmptyRecord } from "@/lib/components/EmptyRecord";
import { Sidebar } from "@/lib/components/Sidebar";

export default function Page({params} : { params: { schoolId: string }}) {
    const router = useRouter();
    const [dhs, setDhs] = useState<Dh[]>([]);
    const [loadingDhs, setLoadingDhs] = useState<boolean>(true);

    const [school, setSchool] = useState<School | null>(null);
    const [loadingSchool, setLoadingSchool] = useState<boolean>(true);

    const [response, setResponse] = useState<FormSubmitResponse | null>(null);
    const [showToast, setShowToast] = useState(false);

    const [deletedResponse, setDeletedResponse] = useState<FormSubmitResponse | null>(null);
    const [showLoadingDelete, setShowLoadingDelete] = useState(false);

    const deleteSchool = async (e: any) => {
        setShowLoadingDelete(true);
        await fetch(`/api/delete-school`, {
            method: "DELETE",
            body: JSON.stringify({
                schoolId: params.schoolId
            })
        })
        .then(res => res.json())
        .then((data: FormSubmitResponse) => {
            setShowLoadingDelete(false);
            if (data?.success) router.push(`/dashboard/schools`);
            setDeletedResponse(data);
        })
    };

    useEffect(() => {
        fetch(`/api/get-school/${params.schoolId}`)
        .then(res => res.json())
        .then(data => {
            setLoadingSchool(false);
            setSchool(data);
        });

        fetch(`/api/get-dhs/${params.schoolId}`)
        .then(res => res.json())
        .then(data => {
            setLoadingDhs(false);
            setDhs(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const deleteDh = async (id: string, index: number) => {
        await fetch(`/api/delete-dh`, {
            method: "DELETE",
            body: JSON.stringify({
                dhId: id
            })
        }).then(res => res.json())
        .then(data => {
            setResponse(data);
            setShowToast(true);
            if (data?.success) {
                let temp = [...dhs]
                temp.splice(index, 1);
                setDhs(temp);
                return true;
            }
            return false;
        });
        return false;
    };

    const handleDelete = async (id: string, index: number) => {
        const res = await deleteDh(id, index);
        return res;
    };

    return (
        <>
        <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"Dining hall has been successfully deleted."} />
        <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
            <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 lg:col-span-2 divide-y divide-slate-700">
                <div className="w-full px-6 py-4 my-3">
                    {
                        !loadingSchool && !loadingDhs ?
                        <Header response={deletedResponse} showLoading={showLoadingDelete} onDelete={deleteSchool} headerTitle={school!.schoolname}
                        headerPhotoPath={school?.schoolphoto ? school.schoolphoto : ''} isDraft={school!.isdraft}
                        goBackUrl={`/dashboard/schools`} />
                        :
                        <div className="w-full h-16 animate-pulse bg-slate-700 rounded">
                        </div>
                    }
                </div>
                <table className="table auto w-full">
                    <thead className="border-0 border-b border-gray-700">
                        <tr className="text-left">
                            <th scope="col" className="p-6 text-gray-400">Name</th>
                            <th scope="col" className="p-6 text-gray-400">Rating</th>
                            <th scope="col" className="p-6 text-gray-400"></th>
                        </tr>
                    </thead>
                    {
                        !loadingDhs &&
                        (
                            dhs.map((dh: Dh, i) => (
                                <tr key={dh.id} className="text-left">
                                    <DhElement dh={dh} onDelete={() => handleDelete(dh.id, i)} />
                                </tr>
                            ))
                        )
                    }
                </table>
                {
                    loadingDhs && <TableSkeleton />
                }
                {
                    !loadingDhs &&
                    dhs.length === 0 &&
                    <EmptyRecord recordType={"dining hall"}>
                        <TbBuildingStore size={24} />
                    </EmptyRecord>
                }
            </div>
            <div className="bg-slate-900 rounded-md border border-gray-700 invisible lg:visible divide-y divide-slate-700">
                <div className="w-full p-6">
                    <Sidebar loading={loadingSchool} data={school!} photo={!loadingSchool ? school!.schoolimage : ""} />
                    <div className="w-full flex items-center py-4 gap-4 my-2">
                        <IoLocationOutline size={28} />
                        <div>
                            <h3 className="font-semibold text-gray-400">Location</h3>
                            {
                                !loadingSchool
                                ? <p>{school!.schoolstate}</p>
                                : <div className="animate-pulse w-full h-4 bg-slate-700 rounded mt-1"></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}