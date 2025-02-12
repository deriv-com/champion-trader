import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) => {
  if (!isOpen) return null;

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  // Prevent scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        className={cn(
          "relative bg-white rounded-3xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-2",
          className
        )}
      >
        <div className="flex items-center justify-between p-4">
          {title && <h2 className="text-xl font-bold px-4 pt-2">{title}</h2>}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
