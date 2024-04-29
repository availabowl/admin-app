"use client"
import { useState, useEffect } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegTrashCan, FaArrowLeft } from 'react-icons/fa6';
import { MdCloudUpload, MdOutlineRateReview } from 'react-icons/md';
import { IoLinkSharp } from 'react-icons/io5';

import { Dh, FormSubmitResponse } from '@/types/db_interfaces';
import { Toast } from '@/lib/components/Toast';

export default function Page({params} : { params: { schoolId: string, dhId: string}}) {
    const [dh, setDh] = useState<Dh | null>(null);
    const [newDh, setNewDh] = useState<Dh | null>(null);
    const [loading, setLoading] = useState(true);
    const [dhPhoto, setdhPhoto] = useState<File | null>(null);

    const [disabled, setDisabled] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [response, setResponse] = useState<FormSubmitResponse | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/get-dh/${params.dhId}`)
        .then(res => res.json())
        .then(data => {
            setDh(data);
            setNewDh(data);
            setLoading(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loading) {
            setDisabled(_.isEqual(newDh, dh) && !dhPhoto);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newDh, dhPhoto, dh]);

    useEffect(() => {
        if (response && response?.success) setDisabled(true);
    }, [response]);

    const handleUploadPhoto = (e: any) => {
        try {
            setdhPhoto(e.target.files[0]);
            setDisabled(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOnSubmit = async (e: any) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setLoadingSubmit(true);
            await fetch(`/api/update-dh`, {
                method: "POST",
                body: formData
            }).then(res => res.json())
            .then(data => {
                setResponse(data);
                setLoadingSubmit(false);
                
                if (data?.success) {
                    setDh(data);
                    setNewDh(data);
                    if (dhPhoto) setdhPhoto(null);
                    setDisabled(true);
                }
            });
        } catch (error) {
            console.error(error);
            setLoadingSubmit(false);
        } finally {
            setShowToast(true);
        }
    };

    const [showToast, setShowToast] = useState(false);

    return (
        <>
        <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"Dining hall successfully updated."} />
        <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
            <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 xl:col-span-2 divide-y divide-slate-700">
                <div className="w-full px-6 py-4 my-3">
                {
                    !loading
                    ?
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href={`/dashboard/schools/${params.schoolId}/${params.dhId}`} className="rounded-full flex items-center justify-center p-4 bg-slate-700">
                                <FaArrowLeft size={16} />
                            </Link>
                            <h1 className="text-2xl font-bold">Edit {dh?.dhname}</h1>
                        </div>
                    </div>
                    :
                    <div className="w-full h-12 animate-pulse bg-slate-700 rounded">
                    </div>
                }
                    <form className="my-4 flex flex-col" onSubmit={handleOnSubmit}>
                        <input type="hidden" name="dhId" id="dhId" value={params.dhId} />
                        <div className="w-full flex flex-wrap justify-between gap-4 mb-8">
                            <section className="flex flex-col py-4 grow">
                                <label htmlFor="dhName" className="font-semibold">Dining hall name</label>
                                {
                                    !loading
                                    ?
                                    <input type="text" name="dhName" minLength={1} maxLength={100} placeholder="Write vendor name here"
                                    onChange={e => setNewDh({...newDh!, dhname: e.target.value})} 
                                    className="bg-slate-900 outline-none border border-gray-700 py-3 px-4 mt-2 rounded flex grow text-gray-300" defaultValue={dh?.dhname} />
                                    :
                                    <div className="flex grow h-12 animate-pulse bg-slate-700 rounded mt-2">
                                    </div>
                                }
                                <p className="text-sm mt-2 text-gray-400">Your changes will not submit if the same dining hall name exists within the school.</p>
                            </section>
                        </div>
                        <div className="flex flex-wrap w-full justify-between gap-7 mb-6">
                            <div className="w-full xl:w-[50%]">
                                <h4 className="font-semibold mb-4">Dining hall banner (optional)</h4>
                                <p className="text-gray-400">We recommend an image with minimum dimensions of 800x600. The S3 server will have a scaled down version and cropped to fit that ratio.</p>
                            </div>
                            <label htmlFor="dhPhoto" className="relative cursor-pointer flex flex-wrap grow py-12 px-4 border-2 border-dashed border-gray-600 h-full items-center justify-center">
                                <div className="flex flex-col justify-center items-center">
                                    <MdCloudUpload size={32} color="#aaaaaa" />
                                    <p className="text-gray-400">
                                        Upload image
                                    </p>
                                    <input type="file" id="dhPhoto" name="dhPhoto" accept="image/*"
                                        onChange={handleUploadPhoto}
                                        max={1} className="hidden" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col w-full">
                            <p className="font-semibold">Additional settings</p>
                            <div className="w-full flex items-center justify-between my-4">
                                <p className="text-gray-400">Hide from users (draft mode)</p>
                                {
                                    !loading
                                    ?
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value={String(newDh?.isdraft)} className="sr-only peer"
                                        defaultChecked={newDh?.isdraft} name="isDraft"
                                        onChange={e => setNewDh({...newDh!, isdraft: e.target.checked})}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                    : <div className="h-6 w-11 animate-pulse bg-slate-700 rounded-full"></div>
                                }
                            </div>
                        </div>
                        <button className="bg-sky-500/50 rounded font-semibold px-5 py-3 my-10 w-[75px] flex items-center justify-center text-center disabled:opacity-50" 
                        disabled={disabled} type="submit">
                            {
                                loadingSubmit ?
                                <div role="status">
                                    <svg aria-hidden="true" className="w-5 h-5 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                : <p>Save</p>

                            }
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex p-4 bg-slate-900 rounded-md border border-gray-700 invisible xl:visible">
                <div className="w-full p-6">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Information</h1>
                    </div>
                    <div className="w-full flex flex-col py-4">
                        <label htmlFor="dhPhotoPreview" className="font-semibold mb-2">Preview</label>
                        <div className="relative">
                            {
                                dhPhoto && 
                                <div className="absolute rounded-full bg-black flex items-center justify-center p-3 right-2 top-2 bg-opacity-70 cursor-pointer z-75" onClick={() => setdhPhoto(null)}>
                                    <FaRegTrashCan size={20}/>
                                </div>
                            }
                            {
                                !loading ? (
                                    dh?.dhphoto || dhPhoto
                                    ?
                                    <Image src={dhPhoto ? URL.createObjectURL(dhPhoto) : (process.env.NEXT_PUBLIC_S3_URL + dh!.dhphoto)}
                                    className="w-full h-[250px] object-cover rounded"
                                    width={400}
                                    height={250}
                                    alt="Vendor photo" />
                                    : <div className="w-full h-[255px] bg-slate-700 rounded mt-2"></div>
                                )
                                : <div className="w-full h-[255px] bg-slate-700 rounded animate-pulse mt-2"></div>
                            }
                        </div>
                    </div>
                    <div className="w-full flex items-center py-4 gap-4 my-2">
                        <div className="flex gap-3">
                            <div className="flex items-center rounded-md border border-gray-700 p-3">
                                <IoLinkSharp size={24} />
                            </div>
                            <div>
                                <h6 className="font-semibold">URL encoded name</h6>
                                {
                                    !loading
                                    ? <p className="text-gray-400">{dh!.uriencodedname}</p>
                                    : <div className="w-[100px] h-[14px] bg-slate-700 rounded animate-pulse mt-2"></div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex items-center py-4 gap-4 my-2">
                        <div className="flex items-center rounded-md border border-gray-700 p-3">
                            <MdOutlineRateReview size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Total reviews</h3>
                            {
                                !loading
                                ? <p className="text-gray-400">{String(dh!.numreviews)}</p>
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