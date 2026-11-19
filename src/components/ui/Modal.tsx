import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // Tutup pakai Escape (sesuai prototype)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,12,11,0.48)] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] animate-[modal-pop_.16s_ease-out] rounded-xl bg-white p-6 shadow-lg dark:bg-[#1a1b1d]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-[#edf4ed] dark:text-gray-400 dark:hover:bg-neutral-800"
            aria-label="Tutup"
          >
            <i className="fas fa-xmark"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
