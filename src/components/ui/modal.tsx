import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { PrimaryButton } from "./primary-button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    headerContent?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    actionButton?: {
        show: boolean;
        label: string;
        onClick: () => void;
    };
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    headerContent,
    children,
    className,
    actionButton,
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <div className="fixed inset-0 bg-black/80" onClick={onClose} />
            <div
                className={cn(
                    "relative bg-theme rounded-3xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col p-[32px]",
                    className
                )}
            >
                <div className="flex items-center justify-between pb-6">
                    {title && <h2 className="text-xl font-bold text-theme">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-theme-hover transition-colors text-theme"
                        aria-label="Close modal"
                    >
                        <X />
                    </button>
                </div>
                {headerContent && <div className="pb-4">{headerContent}</div>}

                <div className="overflow-y-auto scrollbar-thin flex-1">{children}</div>
                {actionButton?.show && (
                    <div className="pt-4">
                        <PrimaryButton
                            className="w-full rounded-3xl"
                            onClick={actionButton.onClick}
                        >
                            {actionButton.label}
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
};
