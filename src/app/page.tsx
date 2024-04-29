"use client"
import { signIn } from "next-auth/react"
import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function Home() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        await signIn('username-login', {
            userValue: formData.get('username'),
            password: formData.get('password'),
            callbackUrl: '/dashboard/schools'
        }).finally(() => {
            setLoading(false);
        })
    };

    return (
        <main className="min-h-screen">
            <div className="w-full max-w-lg p-6 flex">
                <div className="flex gap-2 items-center">
                    <Image src="https://www.availabowl.com/static/icon-41a9356014521970f5c307fbe69d7e39.png" 
                    alt="Availabowl Logo" width="35" height="35" className="self-center" />
                    <h1 className="font-bold text-xl">Availabowl</h1>
                </div>
            </div>
            <div className="min-w-full max-w-md sm:p-8 flex items-center justify-center">
                <form className="py-11 px-9 w-[625px] max-w-full bg-slate-900 rounded-lg border border-gray-700 shadow" autoComplete="off" onSubmit={onSubmit}>
                    <h1 className="text-3xl font-bold mb-6">Sign in to admin app</h1>
                    <label className="text-slate-400 font-semibold">Username</label>
                    <input type="text" name="username" placeholder="Username" autoComplete="off"
                    className="shadow outline-none w-full py-[12px] px-4 text-md my-2 mb-10 bg-gray-800 border border-gray-700 rounded-lg" />
                    <label className="text-slate-400 font-semibold">Password</label>
                    <input type="password" name="password" placeholder="Password" autoComplete="off"
                    className="shadow outline-none w-full rounded-lg py-[12px] px-4 text-md my-2 bg-gray-800 border border-gray-700" />
                    <button className="shadow mt-12 w-full bg-white text-black rounded-full p-3 font-semibold flex items-center text-center justify-center" type="submit">
                        {
                            loading
                            ?
                            <div role="status">
                                <svg aria-hidden="true" className="w-5 h-5 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            : <span>Sign in</span>
                        }
                    </button>
                </form>
            </div>
        </main>
    );
}
