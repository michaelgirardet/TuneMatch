import { toast } from 'react-toastify';

export function ToasterSuccess(message: string) {
  toast.success(message, {
    position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
    className: 'toast-success',
  });
}

export function ToasterWarning(message: string) {
  toast.warn(message, {
    position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
  });
}

export function ToasterInformation(message: string) {
  toast.info(message, {
    position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
  });
}

export function ToasterError(message: string) {
  toast.error(message, {
    position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
    className: 'toast-error',
  });
}
