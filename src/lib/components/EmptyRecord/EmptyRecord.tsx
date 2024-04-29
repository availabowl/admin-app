import { usePathname } from "next/navigation";
import Link from "next/link";

interface EmptyRecordProps {
    recordType: string,
    children: React.ReactNode
};

const EmptyRecord = ({recordType, children} : EmptyRecordProps) => {
    const pathname = usePathname();

    return (
        <div className="w-full px-4 py-10 flex flex-col items-center justify-center">
            <div className="bg-slate-600 rounded-full p-4 flex items-center justify-center mb-6">
                {children}
            </div>
            <h2 className="text-2xl font-semibold mb-3">No {recordType}s found</h2>
            <p className="text-slate-300 mb-8">There are no {recordType}s that exist yet.</p>
            <Link className="py-3 px-8 flex items-center text-center justify-center bg-slate-700 rounded"
            href={`${pathname}/add`}
            >
                <p>Add a {recordType}</p>
            </Link>
        </div>
    )
};

export { EmptyRecord };