'use client';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
  open, onClose, onConfirm,
  title, message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps) {
  const confirmColors = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/40'
    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/40';

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className={`w-7 h-7 ${variant === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold text-white transition-all shadow-lg ${confirmColors}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
