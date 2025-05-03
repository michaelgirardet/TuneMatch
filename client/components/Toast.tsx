'use client';

import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
}

export function ToasterSuccess({ message }: ToastProps) {
  useEffect(() => {
    toast.success(message, {
      position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
      className: 'toast-success font-sulphur',
    });
  }, [message]);
  
  return null;
}

export function ToasterWarning({ message }: ToastProps) {
  useEffect(() => {
    toast.warn(message, {
      position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
      className: 'font-sulphur',
    });
  }, [message]);
  
  return null;
}

export function ToasterInformation({ message }: ToastProps) {
  useEffect(() => {
    toast.info(message, {
      position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
      className: 'font-sulphur',
    });
  }, [message]);
  
  return null;
}

export function ToasterError({ message }: ToastProps) {
  useEffect(() => {
    toast.error(message, {
      position: window.innerWidth < 768 ? 'top-right' : 'bottom-right',
      className: 'font-sulphur',
    });
  }, [message]);
  
  return null;
}
