import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className={`min-w-[300px] p-5 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border ${
                t.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
                t.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' :
                'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <div className="shrink-0 p-2 bg-white/20 rounded-xl">
                 {t.type === 'success' && <CheckCircle2 size={20} />}
                 {t.type === 'error' && <AlertCircle size={20} />}
                 {t.type === 'info' && <Info size={20} />}
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{t.type}</p>
                 <p className="text-sm font-bold leading-tight">{t.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
