'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCircleCheck, faCircleXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

// Criação do Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration: number = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const color = {
    success: 'bg-[#D7E2D8] text-[#327836]', 
    error: 'bg-red-200 text-red-600', 
    info: 'bg-blue-200 text-blue-600'
  }

  const icon = {
    success: faCircleCheck, 
    error: faCircleXmark, 
    info: faCircleExclamation
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        {toasts.map(({ id, message, type }) => (
          <div key={id} className={`flex justify-between mb-2 p-6 rounded-xl shadow-lg w-fit lg:min-w-[808px]  ${color[type]}`}>
            <div>
              <FontAwesomeIcon className='h-4 mr-3' icon={icon[type]} />
              {message}
            </div>

            <button type='button' onClick={() => removeToast(id)}>
              <FontAwesomeIcon className='h-5' icon={faXmark} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
