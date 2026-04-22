import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

/**
 * ToastProvider — manages a queue of toast notifications.
 * Each toast auto-dismisses after `duration` ms.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const addToast = useCallback((message, duration = 2500) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
