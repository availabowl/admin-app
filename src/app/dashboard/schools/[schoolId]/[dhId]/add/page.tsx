"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { FiX } from 'react-icons/fi';
import { FaArrowLeft, FaRegTrashCan } from 'react-icons/fa6';
import { MdOutlineInsertPhoto, MdCloudUpload } from 'react-icons/md';

import { Dh, FormSubmitResponse } from '@/types/db_interfaces';
import { Toast } from '@/lib/components/Toast';

export default function Page({params} : { params: { schoolId: string, dhId: string }}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dh, setDh] = useState<Dh | null>(null);
    
    const [loadingRes, setLoadingRes] = useState(false);
    const [response, setResponse] = useState<FormSubmitResponse | null>(null);
    const [showToast, setShowToast] = useState(false);

    const [newIcon, setNewIcon] = useState<File | null>(null);
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [disabled, setDisabled] = useState(false);

    const [isDraft, setIsDraft] = useState(true);
    const [overrideIcon, setOverrideIcon] = useState(false);
    const [overridePhoto, setOverridePhoto] = useState(false);

    const handleUploadIcon = (e: any) => {
        try {
            setNewIcon(e.target.files[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUploadPhoto = (e: any) => {
        try {
            setNewPhoto(e.target.files[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetch(`/api/get-dh/${params.dhId}`)
        .then(res => res.json())
        .then(data => {
            setDh(data);
            setLoading(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setLoadingRes(true);
            const formData = new FormData(e.currentTarget);
            formData.append('isDraft', String(isDraft));
            formData.append('overrideVendorIcon', String(overrideIcon));
            formData.append('overrideVendorPhoto', String(overridePhoto));

            await fetch(`/api/add-vendor`, {
                method: 'post',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                setResponse(data);
                setDisabled(true);
                if (data?.error) {
                    setShowToast(true);
                    setLoadingRes(false);
                    setDisabled(false);
                } else if (data?.success) {
                    router.push(`/dashboard/schools/${params.schoolId}/${params.dhId}/${data?.vendorId}`);
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
        <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"Vendor has successfully been created."} />
        <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
            <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 lg:col-span-2 divide-y divide-slate-700">
                <div className="w-full px-6 py-4 my-3">
                    <div className="flex items-center gap-6">
                        <Link href={`/dashboard/schools/${params.schoolId}/${params.dhId}`} className="rounded-full flex items-center justify-center p-4 bg-slate-700">
                            <FaArrowLeft size={16} />
                        </Link>
                        {
                            !loading
                            ? <h1 className="font-bold text-2xl">Add vendor to {dh?.dhname}</h1>
                            : <div className="animate-pulse w-full h-10 bg-slate-700 rounded mt-1"></div>
                        }
                    </div>
                    <form className="my-4 flex flex-col" onSubmit={handleOnSubmit}>
                        <input type="hidden" name="schoolId" id="schoolId" value={params.schoolId} />
                        <input type="hidden" name="dhId" id="dhId" value={params.dhId} />
                        <div className="w-full py-4">
                            <div className="flex items-center gap-6">
                                {
                                    !newIcon 
                                    ? <div className="w-[80px] h-[80px] rounded-full bg-slate-800"></div>
                                    : <Image src={URL.createObjectURL(newIcon)} className="rounded-full object-cover w-[80px] h-[80px]" width={80} height={80} alt={`Vendor icon`} />
                                }
                                <div className="flex items-center gap-3">
                                    <label htmlFor="newIcon" className="cursor-pointer font-semibold bg-white text-black py-3 px-5 rounded-full text-sm flex items-center gap-2">
                                        <MdOutlineInsertPhoto size={20} />Upload vendor icon photo
                                        <input type="file" id="newIcon" name="newIcon" accept="image/*"
                                        onChange={handleUploadIcon}
                                        max={1} className="hidden" />
                                    </label>
                                    {
                                        newIcon && <FaRegTrashCan size={24} color="#aaaaaa" className="cursor-pointer" onClick={() => setNewIcon(null)} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-wrap justify-between gap-4 mb-8">
                            <section className="flex flex-col py-4 grow">
                                <label htmlFor="vendorName" className="font-semibold">Vendor name</label>
                                {
                                    !loading
                                    ?
                                    <input type="text" name="vendorName" minLength={1} maxLength={100} placeholder="Write vendor name here"
                                    className="bg-slate-900 outline-none border border-gray-700 py-3 px-4 mt-2 rounded flex grow text-gray-300" />
                                    :
                                    <div className="flex grow h-12 animate-pulse bg-slate-700 rounded mt-2">
                                    </div>
                                }
                                <p className="text-sm mt-2 text-gray-400">Your changes will not submit if the same vendor name exists within the dining hall.</p>
                            </section>
                            <section className="flex flex-col py-4">
                                <label htmlFor="category" className="font-semibold">Category</label>
                                {
                                    !loading
                                    ?
                                    <div className="border border-gray-700 py-3 px-4 mt-2 rounded sm:w-[250px] w-full relative">
                                        <select name="vendorcategory" defaultValue="Uncategorized" className="bg-slate-900 outline-none w-[100%] text-gray-300">
                                            <option value="Asian">Asian</option>
                                            <option value="American">American</option>
                                            <option value="Barbecue">Barbecue</option>
                                            <option value="Buffet">Buffet</option>
                                            <option value="Burger">Burger</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Coffee & Tea">Coffee & Tea</option>
                                            <option value="Desserts">Desserts</option>
                                            <option value="Ethnic">Ethnic</option>
                                            <option value="Fast Food">Fast food</option>
                                            <option value="Grab & Go">Grab & Go</option>
                                            <option value="Greek">Greek</option>
                                            <option value="Healthy">Healthy</option>
                                            <option value="Ice Cream">Ice Cream</option>
                                            <option value="Indian">Indian</option>
                                            <option value="Italian">Italian</option>
                                            <option value="Japanese">Japanese</option>
                                            <option value="Korean">Korean</option>
                                            <option value="Latin American">Latin American</option>
                                            <option value="Mediterranean">Mediterranean</option>
                                            <option value="Mexican">Mexican</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Salads">Salads</option>
                                            <option value="Sandwiches & Subs">Sandwiches & Subs</option>
                                            <option value="Smoothies">Smoothies</option>
                                            <option value="Soul">Soul</option>
                                            <option value="Uncategorized">Uncategorized</option>
                                        </select>
                                    </div>
                                    :
                                    <div className="w-[250px] h-12 animate-pulse bg-slate-700 rounded mt-2"></div>
                                }
                            </section>
                        </div>
                        <div className="flex flex-wrap w-full justify-between gap-7 mb-6">
                            <div className="w-full xl:w-[50%]">
                                <h4 className="font-semibold mb-4">Featured vendor photo (optional)</h4>
                                <p className="text-gray-400">We recommend an image with minimum dimensions of 1000x750. When uploaded, the S3 server will have a scaled down version and cropped to fit that ratio.</p>
                            </div>
                            <label htmlFor="newPhoto" className="relative cursor-pointer flex flex-wrap grow py-12 px-4 border-2 border-dashed border-gray-600 h-full items-center justify-center">
                                <div className="flex flex-col justify-center items-center">
                                    {
                                        !newPhoto ?
                                        <>
                                        <MdCloudUpload size={32} color="#aaaaaa" />
                                        <p className="text-gray-400">
                                            Upload image
                                        </p>
                                        </>
                                        :
                                        <div className="relative flex items-center justify-center z-30">
                                            <button onClick={() => setNewPhoto(null)} className="bg-black rounded-full p-[2px] absolute top-1 right-1 bg-opacity-70 z-50">
                                                <FiX />
                                            </button>
                                            <Image src={URL.createObjectURL(newPhoto)} width={120} height={120} 
                                            className="rounded w-full h-[200px] object-cover z-40" alt="Vendor photo to upload" />
                                        </div>
                                    }
                                    <input type="file" id="newPhoto" name="newPhoto" accept="image/*"
                                        onChange={handleUploadPhoto}
                                        max={1} className="hidden" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col w-full mt-8">
                            <p className="font-semibold">Additional settings</p>
                            <div className="w-full flex items-center justify-between my-4">
                                <p className="text-gray-400">Hide from users (draft mode)</p>
                                {
                                    !loading
                                    ?
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" name="isdraft" id="isdraft" checked={isDraft} onChange={e => setIsDraft(e.target.checked)}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                    : <div className="h-6 w-11 animate-pulse bg-slate-700 rounded-full"></div>
                                }
                            </div>
                            <div className="w-full flex items-center justify-between my-4">
                                <p className="text-gray-400">Override default vendor icon</p>
                                {
                                    !loading
                                    ?
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" name="overridevendoricon" id="overridevendoricon"
                                        onChange={e => setOverrideIcon(e.target.checked)} checked={overrideIcon}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                    : <div className="h-6 w-11 animate-pulse bg-slate-700 rounded-full"></div>
                                }
                            </div>
                            <div className="w-full flex items-center justify-between my-4">
                                <p className="text-gray-400">Override default vendor preview photo</p>
                                {
                                    !loading
                                    ?
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" name="overridevendorphoto" id="overridevendorphoto"
                                        onChange={e => setOverridePhoto(e.target.checked)} checked={overridePhoto}
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                    : <div className="h-6 w-11 animate-pulse bg-slate-700 rounded-full"></div>
                                }
                            </div>
                            <button className="bg-sky-500/50 rounded font-semibold px-5 py-3 my-10 w-[75px] flex items-center justify-center text-center disabled:opacity-50" 
                            disabled={disabled} type="submit">
                                {
                                    loadingRes ?
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
                        </div>
                    </form>
                </div>
            </div>
            <div className="bg-slate-900 rounded-md border border-gray-700 invisible lg:visible divide-y divide-slate-700">

            </div>
        </div>
        </>
    )
}