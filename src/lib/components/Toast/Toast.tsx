import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';
import { FormSubmitResponse } from '@/types/db_interfaces';

type ToastProps = {
    showToast: boolean,
    setShowToast: Dispatch<SetStateAction<boolean>>,
    response: FormSubmitResponse | null,
    successMessage: string
}

const Toast = ({showToast, setShowToast, response, successMessage} : ToastProps) => {
    return (
        showToast &&
        <div id="toast-default" className="flex items-center justify-between w-full p-4 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-slate-700 z-50 fixed bottom-0 left-0" 
        role="alert">
            {
                response?.success ? <p>{successMessage}</p> : <p>Error: {response?.error}</p>
            }
            <button onClick={() => setShowToast(!showToast)}>
                <FiX color="white" />
            </button>
        </div>
    )
};

export { Toast };