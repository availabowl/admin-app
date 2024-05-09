"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { FormSubmitResponse, School } from '@/types/db_interfaces';
import { useRouter } from 'next/navigation';
import { Toast } from '@/lib/components/Toast';

export default function Page({params} : { params: { schoolId: string, dhId: string }}) {
    const router = useRouter();
    const [school, setSchool] = useState<School | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [response, setResponse] = useState<FormSubmitResponse | null>(null);
    const [loadingRes, setLoadingRes] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        setLoading(true);
        setDisabled(true);
        fetch(`/api/get-school/${params.schoolId}`)
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            setSchool(data);
            setDisabled(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingRes(true);
            const formData = new FormData(e.currentTarget);
            await fetch(`/api/add-dh`, {
                method: 'post',
                body: formData
            })
            .then(res => res.json())
            .then((data: FormSubmitResponse) => {
                setResponse(data);
                if (data?.error) {
                    setShowToast(true);
                    setLoadingRes(false);
                    setDisabled(false);
                } else if (data?.success) {
                    router.push(`/dashboard/schools/${params.schoolId}/${data?.dhId}`);
                }
                setLoadingRes(false);
            })
        } catch (error) {
            console.error(error);
            setShowToast(true);
            setLoadingRes(false);
            setDisabled(false);
        }
    }

    return (
        <>
        <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"Dining hall has successfully been created."} />
        <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
            <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 xl:col-span-2 divide-y divide-slate-700">
                <div className="w-full px-6 py-4 my-3">
                    <div className="flex items-center gap-6">
                        <Link href={`/dashboard/schools/${params.schoolId}`} className="rounded-full flex items-center justify-center p-4 bg-slate-700">
                            <FaArrowLeft size={16} />
                        </Link>
                        {
                            !loading
                            ? <h1 className="font-bold text-2xl">Add dining hall to {school?.schoolname}</h1>
                            : <div className="animate-pulse w-full h-10 bg-slate-700 rounded mt-1"></div>
                        }
                    </div>
                    <form className="my-4 flex flex-col" onSubmit={handleOnSubmit}>
                        <input type="hidden" name="schoolId" id="schoolId" value={params.schoolId} />
                        <div className="w-full flex flex-wrap justify-between gap-4">
                            <section className="flex flex-col py-4 grow">
                                <label htmlFor="dhName" className="font-semibold">Dining hall name</label>
                                <input type="text" name="dhName" minLength={1} maxLength={100} placeholder="Write dining hall name here"
                                className="bg-slate-900 outline-none border border-gray-700 py-3 px-4 mt-2 rounded flex grow text-gray-300" autoComplete="false" />
                                <p className="text-sm mt-2 text-gray-400">Your dining hall will not be created if its URL encoded name results in a duplicate.</p>
                            </section>
                        </div>
                        <button disabled={disabled} className="bg-sky-500/50 rounded font-semibold px-10 py-3 my-5 w-[75px] flex items-center justify-center text-center disabled:opacity-50" 
                        type="submit">
                            {
                                loadingRes
                                ?
                                <div role="status">
                                    <svg aria-hidden="true" className="w-5 h-5 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                : <p>Create</p>
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}