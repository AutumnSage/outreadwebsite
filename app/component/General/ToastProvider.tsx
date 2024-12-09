// app/components/ToastProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import Toast from './Toast';

interface ToastContextType {
    showToast: (message: string, type: 'error' | 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

    const showToast = (message: string, type: 'error' | 'success' | 'info') => {
        setToast({ message, type });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
};