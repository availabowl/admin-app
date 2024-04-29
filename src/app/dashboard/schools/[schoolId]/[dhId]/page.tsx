"use client"
import { useState, useEffect } from "react";
import { Dh, FormSubmitResponse, Vendor } from "@/types/db_interfaces";
import { MdOutlineFastfood } from "react-icons/md";
import { useRouter } from "next/navigation";

import { TableSkeleton } from "@/lib/components/TableSkeleton/TableSkeleton";
import { Toast } from "@/lib/components/Toast/Toast";
import { VendorElement } from "@/lib/components/Vendor";
import { Header } from "@/lib/components/Header";
import { EmptyRecord } from "@/lib/components/EmptyRecord";
import { Sidebar } from "@/lib/components/Sidebar";

export default function Page({params} : { params: { schoolId: string, dhId: string }}) {
    const router = useRouter();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState<boolean>(true);

    const [dh, setDh] = useState<Dh | null>(null);
    const [loadingDh, setLoadingDh] = useState<boolean>(true);

    const [response, setResponse] = useState<FormSubmitResponse | null>(null);
    const [showToast, setShowToast] = useState(false);

    const [deletedResponse, setDeletedResponse] = useState<FormSubmitResponse | null>(null);
    const [showLoadingDelete, setShowLoadingDelete] = useState(false);

    const deleteDh = async (e: any) => {
        setShowLoadingDelete(true);
        await fetch(`/api/delete-dh`, {
            method: "DELETE",
            body: JSON.stringify({
                dhId: params.dhId
            })
        })
        .then(res => res.json())
        .then((data: FormSubmitResponse) => {
            setShowLoadingDelete(false);
            if (data?.success) router.push(`/dashboard/schools/${params.schoolId}`);
            setDeletedResponse(data);
        })
    };

    useEffect(() => {
        fetch(`/api/get-dh/${params.dhId}`)
        .then(res => res.json())
        .then(data => {
            setLoadingDh(false);
            setDh(data);
        });

        fetch(`/api/get-vendors/${params.dhId}`)
        .then(res => res.json())
        .then(data => {
            setLoadingVendors(false);
            setVendors(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteVendor = async (id: string, index: number) => {
        await fetch(`/api/delete-vendor`, {
            method: "DELETE",
            body: JSON.stringify({
                vendorId: id
            })
        }).then(res => res.json())
        .then(data => {
            setResponse(data);
            setShowToast(true);
            if (data?.success) {
                let temp = [...vendors]
                temp.splice(index, 1);
                setVendors(temp);
                return true;
            }
            return false;
        });
        return false;
    };

    const handleDelete = async (id: string, index: number) => {
        const res = await deleteVendor(id, index);
        return res;
    };

    return (
        <>
        <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"Vendor has been successfully deleted."} />
        <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
            <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 lg:col-span-2 divide-y divide-slate-700">
                <div className="w-full px-6 py-4 my-3">
                    {
                        !loadingDh && !loadingVendors ?
                        <Header response={deletedResponse} showLoading={showLoadingDelete} onDelete={deleteDh} headerTitle={dh!.dhname}
                        isDraft={dh!.isdraft} goBackUrl={`/dashboard/schools/${params.schoolId}`} />
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
                            <th scope="col" className="p-6 text-gray-400">Category</th>
                            <th scope="col" className="p-6 text-gray-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loadingVendors &&
                            (
                                vendors.map((vendor: Vendor, i) => (
                                    <tr key={vendor.id} className="text-left">
                                        <VendorElement vendor={vendor} onDelete={() => handleDelete(vendor.id, i)}  />
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
                {
                    loadingVendors && <TableSkeleton />
                    
                }
                {
                    !loadingVendors &&
                    vendors.length === 0 &&
                    <EmptyRecord recordType={"vendor"}>
                        <MdOutlineFastfood size={24} />
                    </EmptyRecord>
                }
            </div>
            <div className="flex p-4 bg-slate-900 rounded-md border border-gray-700 invisible lg:visible">
                <div className="w-full p-6">
                    <Sidebar loading={loadingDh} data={dh!} photo={!loadingDh ? dh!.dhphoto : ""} />
                </div>
            </div>
        </div>
        </>
    )
}