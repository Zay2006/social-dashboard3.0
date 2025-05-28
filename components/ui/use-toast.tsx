import * as React from "react";

/**
 * Simplified toast implementation to avoid TypeScript errors
 */

type ToastVariant = "default" | "destructive";

interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface Toast extends ToastProps {
  id: string;
}

export type { Toast };

interface ToastContextType {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
}

let toastId = 0;

const generateId = () => {
  toastId++;
  return `toast-${toastId}`;
};

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

const toast = (props: ToastProps) => {
  const { toast } = React.useContext(ToastContext);
  toast(props);
};

const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((props: ToastProps) => {
    const id = props.id || generateId();
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...props, id } as Toast,
    ]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => 
      prevToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: dismissToast,
  };
};

export { useToast, toast };

