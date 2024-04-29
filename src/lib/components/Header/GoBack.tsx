import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface GoBackProps {
    url: string;
};

const GoBack = ({url} : GoBackProps) => {
    const router = useRouter();
    return <button onClick={() => router.push(url)}><IoIosArrowBack size={24} /></button>;
};

export { GoBack };