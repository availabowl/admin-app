"use client"
import { QueryClient, QueryClientProvider, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import queryString from 'query-string';
import { useInView } from 'react-intersection-observer';
import { IoSearch } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { useState, useEffect } from 'react';
import Link from "next/link";

import { School, FormSubmitResponse } from "@/types/db_interfaces";
import { SchoolElement } from '@/lib/components/School/School';
import { DeleteSchoolMutateProps } from '@/lib/components/School/interfaces';
import { Toast } from '@/lib/components/Toast/Toast';
import { TableSkeleton } from '@/lib/components/TableSkeleton/TableSkeleton';

export default function Page() {
    const client = new QueryClient();
    
    const SchoolsPage = () => {
        const [response, setResponse] = useState<FormSubmitResponse | null>(null);
        const [showToast, setShowToast] = useState(false);

        const [query, setQuery] = useState('');
        const [searchResults, setSearchResults] = useState<School[]>([]);
        const [loadingSearchResults, setLoadingSearchResults] = useState(false);
        const [showPaginated, setShowPaginated] = useState(true);

        useEffect(() => {
            if (query.length === 0) {
                setShowPaginated(true);
            } else {
                setShowPaginated(false);
                setLoadingSearchResults(true);
                fetch(`/api/search-schools?search=${encodeURIComponent(query)}`).then(res => res.json())
                .then(data => {
                    setLoadingSearchResults(false);
                    setSearchResults(data);
                });
            }
        }, [query]);

        const { ref, inView } = useInView();

        const {
            data,
            fetchNextPage,
            isFetchingNextPage,
            isFetching,
            hasNextPage,
            status
        } = useInfiniteQuery({
            queryKey: ['schools'],
            queryFn: async ({pageParam=0}) => {
                const res = await fetch(`/api/schools?start=${pageParam}`);
                return res.json();
            },
            initialPageParam: 0,
            getNextPageParam: (lastPage, _) => {
                if (lastPage.next) {
                    const parsed = queryString.parseUrl(lastPage.next);
                    return Number(parsed.query.start)
                }
                return undefined;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false
        });

        const deleteSchool = useMutation({
            mutationFn: async (variables: DeleteSchoolMutateProps) => {
                await fetch(`/api/delete-school`, {
                    method: 'DELETE',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({schoolId: variables.id})
                }).then(res => res.json())
                .then((data: FormSubmitResponse) => {
                    setShowToast(true);
                    setResponse(data);
                    return data?.success;
                });
                return false;
            },
            onMutate: async (variables: DeleteSchoolMutateProps) => {
                await client.cancelQueries({ queryKey: ['schools'] });
                client.setQueryData(['schools'], (oldData: any) => {
                    let pageIndex = variables.pageIndex;
                    let elementIndex = variables.elementIndex;
                    let newData = {...oldData}.pages;
                    newData[pageIndex].schools[elementIndex].deleted = true;
                    return {
                        ...oldData,
                        pages: newData
                    }
                });
            }
        });
    
        const handleDelete = async (id: string, pageIndex: number, elementIndex: number) => {
            const res = await deleteSchool.mutateAsync({
                id, pageIndex, elementIndex
            });
            return res;
        };

        useEffect(() => {
            if (inView && hasNextPage && !isFetching) {
                fetchNextPage();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hasNextPage, inView, isFetching]);

        return (
            <>
            <Toast showToast={showToast} setShowToast={setShowToast} response={response} successMessage={"School has successfully been deleted."} />
            <div className="grid grid-cols-3 gap-8 mb-4 min-h-screen">
                <div className="bg-slate-900 rounded-md border border-gray-700 col-span-3 divide-y divide-slate-700">
                    <form className="w-full p-6">
                        <div className="flex items-center gap-2 items-center w-full rounded lg:w-[50%] bg-slate-900 border border-gray-700 py-2 px-4">
                            <IoSearch size={22} color="#aaa" />
                            <input type="text" className="outline-none bg-slate-900 grow" placeholder="Search all schools" onChange={e => setQuery(e.target.value)} value={query} />
                            {
                                query.length > 0 &&
                                <button onClick={() => setQuery('')}>
                                    <FiX size={24} color="#aaa" />
                                </button>
                            }
                        </div>
                    </form>
                    <div className="w-full p-6 flex justify-between items-center">
                        <Link href="/dashboard/schools/add" className="rounded-full px-4 py-1.5 bg-blue-400 text-black font-semibold text-sm">
                            Add school
                        </Link>
                    </div>
                    <div>
                        <table className="table-auto w-full">
                            <thead className="border-0 border-b border-gray-700">
                                <tr className="text-left">
                                    <th scope="col" className="p-6 text-gray-400">Name</th>
                                    <th scope="col" className="p-6 text-gray-400">Rating</th>
                                    <th scope="col" className="p-6 text-gray-400">Size</th>
                                    <th scope="col" className="p-6 text-gray-400">Location</th>
                                    <th scope="col" className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                !showPaginated ?
                                (
                                    searchResults.map((school: School) => (
                                        <tr key={school.id}>
                                            <SchoolElement school={school} />
                                        </tr>
                                    ))
                                )
                                :
                                (
                                    data?.pages ?
                                    (
                                        data.pages.map((page: any, idx: number) => (
                                            page.schools.map((school: School, i: number) => (
                                                school.deleted === true 
                                                ? null
                                                :
                                                <tr key={school.id}>
                                                    <SchoolElement school={school} deleteSchool={() => handleDelete(school.id, idx, i)}
                                                    />
                                                </tr>
                                            ))
                                        ))
                                    )
                                    : null
                                )
                            }
                            </tbody>
                        </table>
                        {
                            (status === 'pending' || loadingSearchResults) && <TableSkeleton />
                        }
                        <div ref={ref}>
                            {
                                isFetchingNextPage 
                                ? <TableSkeleton />
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    return (
        <QueryClientProvider client={client}>
            <SchoolsPage />
        </QueryClientProvider>
    )
}