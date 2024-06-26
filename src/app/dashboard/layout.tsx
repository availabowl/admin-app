"use client"
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

import { MdOutlineSpaceDashboard, MdOutlineSchool, MdReportGmailerrorred  } from "react-icons/md";
import { LiaJira } from "react-icons/lia";
import { TbBrandAzure } from "react-icons/tb";

export default function AdminLayout({
    children,
} : Readonly<{children: React.ReactNode;}>) {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <main className="min-h-screen">
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" aria-controls="logo-sidebar" type="button" 
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <div className="flex ms-2 md:me-24 gap-2">
                            <Image src="https://www.availabowl.com/static/icon-41a9356014521970f5c307fbe69d7e39.png" alt="Availabowl Logo" width="40" height="40" />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3 gap-4">
                            <button type="button" className="bg-slate-700 p-3 rounded-full flex items-center justify-center">
                                <span className="sr-only">Open Jira</span>
                                <Link href={process.env.NEXT_PUBLIC_JIRA_URL!}>
                                    <LiaJira size={18} />
                                </Link>
                            </button>
                            <button type="button" className="bg-slate-700 p-3 rounded-full flex items-center justify-center">
                                <span className="sr-only">Open Microsoft Azure</span>
                                <Link href="https://portal.azure.com/">
                                    <TbBrandAzure size={18} />
                                </Link>
                            </button>
                            <div className="relative">
                                <button type="button" className="flex text-sm dark:bg-slate-900 rounded-full" 
                                onClick={() => setMenuOpen(!menuOpen)}>
                                    <span className="sr-only">Open user menu</span>
                                    {
                                        status === 'authenticated'
                                        ?
                                        <Image src={session?.user.image} 
                                        alt="Logged in profile" className="rounded-full cursor-pointer" width={45} height={45} onClick={() => setMenuOpen(!menuOpen)} />
                                        :
                                        <div className="h-[45px] w-[45px] bg-slate-700 rounded-full animate-pulse"></div>
                                    }
                                </button>
                                {
                                    menuOpen &&
                                    <div className="w-60 absolute bg-slate-900 shadow border border-gray-700 rounded-lg top-[55px] right-0">
                                        <ul>
                                            <li className="hover:bg-gray-100 dark:hover:bg-gray-800 group">
                                                <button className="py-4 px-6 font-semibold"
                                                onClick={() => signOut({
                                                    callbackUrl: '/', redirect: true
                                                })}
                                                >Log out</button>
                                            </li>
                                        </ul>
                                    </div> 
                                }
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                </nav>

                <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-slate-900 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 py-2 overflow-y-auto bg-white dark:dark:bg-slate-900">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <MdOutlineSpaceDashboard size={24} />
                                <span className="ms-3 font-semibold">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/schools" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <MdOutlineSchool size={26} />
                                <span className="ms-3 font-semibold">Schools</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={process.env.NEXT_PUBLIC_JIRA_URL!} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <MdReportGmailerrorred size={24}/>
                                <span className="ms-3 font-semibold">Reports</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                </aside>

                <div className="p-4 sm:ml-64 min-h-screen">
                    <div className="mt-14 p-4 min-h-screen">
                        {children}
                    </div>
                </div>
        </main>
    )
}