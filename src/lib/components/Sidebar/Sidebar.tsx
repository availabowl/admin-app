import { IoLinkSharp, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import Image from "next/image";
import { Dh, School, Vendor } from "@/types/db_interfaces";

interface SidebarProps {
    loading: boolean,
    data: School | Dh | Vendor,
    photo?: string
};

const Sidebar = ({loading, data, photo} : SidebarProps) => {
    return (
        <>
        <h1 className="text-xl font-semibold">Information</h1>
        <div className="w-full py-4">
            {
                !loading ? (
                    photo ? 
                    <Image src={process.env.NEXT_PUBLIC_S3_URL + photo}
                    className="w-full h-[250px] object-cover rounded"
                    width={400}
                    height={250}
                    alt="Vendor photo" />
                    : <div className="w-full h-[255px] bg-slate-700 rounded mt-2"></div>
                )
                : <div className="w-full h-[255px] bg-slate-700 rounded animate-pulse mt-2"></div>
            }
        </div>
         <div className="w-full flex items-center py-4 gap-4 my-2">
            <IoLinkSharp size={28} />
            <div>
                <h3 className="font-semibold text-gray-400">URL encoded name</h3>
                {
                    !loading
                    ? <p>{data!.uriencodedname}</p>
                    : <div className="animate-pulse w-full h-4 bg-slate-700 rounded mt-1"></div>
                }
            </div>
        </div>
        <div className="w-full flex items-center py-4 gap-4 my-2">
            {
                !loading
                ? 
                (
                    data!.isdraft
                    ? <IoEyeOffOutline size={24} />
                    : <IoEyeOutline size={24} />
                )
                : <div className="animate-pulse w-7 h-7 bg-slate-700 rounded"></div>
            }
            <div>
                <h3 className="font-semibold text-gray-400">Is visible</h3>
                {
                    !loading
                    ? <p>{data!.isdraft === false ? 'Yes' : 'No'}</p>
                    : <div className="animate-pulse w-full h-4 bg-slate-700 rounded mt-1"></div>
                }
            </div>
        </div>
        <div className="w-full flex items-center py-4 gap-4 my-2">
            <MdOutlineRateReview size={28} />
            <div>
                <h3 className="font-semibold text-gray-400">Total reviews</h3>
                {
                    !loading
                    ? <p>{String(data!.numreviews)}</p>
                    : <div className="animate-pulse w-full h-4 bg-slate-700 rounded mt-1"></div>
                }
            </div>
        </div>
        </>
    )
};

export { Sidebar };