import Image from "next/image";

import { DraftLabel } from "../DraftLabel";
import { EllipsisParentElem } from "../EllipsisParentElem";
import { FormSubmitResponse } from "@/types/db_interfaces";
import { GoBack } from "./GoBack";
import { ArchivedLabel } from "../ArchivedLabel";

interface HeaderProps {
    response: FormSubmitResponse | null,
    showLoading: boolean,
    onDelete: (e: any) => Promise<void>,
    headerTitle: string,
    headerPhotoPath?: string,
    isDraft?: boolean,
    goBackUrl: string,
    isArchived?: boolean
};

const Header = ({response, showLoading, onDelete, headerTitle, headerPhotoPath, isDraft, goBackUrl, isArchived} : HeaderProps) => {
    
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mt-4">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-6">
                    <GoBack url={goBackUrl} />
                    <span className="sr-only">Go back</span>
                    <p className="flex items-center gap-3">
                        {
                            headerPhotoPath
                            ? <Image src={process.env.NEXT_PUBLIC_S3_URL + headerPhotoPath} className="rounded-full" width={40} height={40} alt={`${headerTitle} icon`} />
                            : <div className="w-[40px] h-[40px] rounded-full bg-slate-800"></div>
                        }
                        <span className="text-ellipsis overflow-hidden ...">{headerTitle}</span>
                    </p>
                </h1>
                {
                    isDraft && <DraftLabel />
                }
                {
                    isArchived && <ArchivedLabel />
                }
            </div>
            <EllipsisParentElem response={response} showLoading={showLoading} 
            onDelete={onDelete} /> 
        </div>
    )
};

export { Header };