'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface ToastProps {
  message: string;
}

export function ToasterSuccess({ message }: ToastProps) {
  useEffect(() => {
    toast.success(message, {
      position: window.innerWidth < 768 ? 'bottom-right' : 'bottom-right',
      className: 'toast-success font-quicksand',
    });
  }, [message]);

  return null;
}

export function ToasterWarning({ message }: ToastProps) {
  useEffect(() => {
    toast.warn(message, {
      position: window.innerWidth < 768 ? 'bottom-right' : 'bottom-right',
      className: 'font-quicksand',
    });
  }, [message]);

  return null;
}

export function ToasterInformation({ message }: ToastProps) {
  useEffect(() => {
    toast.info(message, {
      position: window.innerWidth < 768 ? 'bottom-right' : 'bottom-right',
      className: 'font-quicksand',
    });
  }, [message]);

  return null;
}

export function ToasterError({ message }: ToastProps) {
  useEffect(() => {
    toast.error(message, {
      position: window.innerWidth < 768 ? 'bottom-right' : 'bottom-right',
      className: 'font-quicksand',
    });
  }, [message]);

  return null;
}
