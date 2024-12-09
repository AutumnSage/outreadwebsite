// app/components/Toast.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'error' | 'success' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-4 right-4 flex items-center p-4 mb-4 text-sm rounded-lg ${type === 'error' ? 'text-red-800 bg-red-50' :
            type === 'success' ? 'text-green-800 bg-green-50' :
                'text-blue-800 bg-blue-50'
            }`} role="alert">
            <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
            <span className="sr-only">Info</span>
            <div>{message}</div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8"
                onClick={() => {
                    setIsVisible(false);
                    onClose();
                }}
            >
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Toast;
