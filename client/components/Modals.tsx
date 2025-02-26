interface ModalProps {
  message: string;
}

export function SuccessModal({ message }: ModalProps) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
      {message}
    </div>
  );
}

export function ErrModal({ message }: ModalProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {message}
    </div>
  );
} 