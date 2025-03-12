import { useEffect } from "react";
import { cn } from "@/lib/utils";

type ToastPosition = "bottom-left" | "bottom-center" | "bottom-right" | "top-center";
type ToastVariant = "success" | "error" | "warning" | "info" | "default";

export interface ToastProps {
    content: React.ReactNode;
    variant?: ToastVariant;
    onClose: () => void;
    duration?: number;
    position?: ToastPosition;
}

export const Toast = ({
    content,
    variant = "default",
    onClose,
    duration = 3000,
    position = "bottom-center",
}: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={cn(
                "fixed z-[99999] px-4 py-3 rounded-md shadow-lg",
                "w-[100%] max-w-[320px]", // Set minimum width and allow content to wrap
                // Position classes
                {
                    "bottom-4 left-4": position === "bottom-left",
                    "bottom-4 left-1/2 -translate-x-1/2": position === "bottom-center",
                    "bottom-4 right-4": position === "bottom-right",
                    "top-4 left-1/2 -translate-x-1/2": position === "top-center",
                },
                // Animation classes
                {
                    "animate-in fade-in slide-in-from-bottom-4": position.startsWith("bottom"),
                    "animate-in fade-in slide-in-from-top-4": position.startsWith("top"),
                },
                // Variant-specific styling
                {
                    "bg-green-500 text-white": variant === "success",
                    "bg-red-500 text-white": variant === "error",
                    "bg-amber-500 text-white": variant === "warning",
                    "bg-blue-500 text-white": variant === "info",
                    "bg-gray-700 text-white": variant === "default",
                }
            )}
            role="alert"
        >
            {typeof content === "string" ? (
                <div className="flex items-start gap-2">
                    {variant === "success" && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                    {variant === "error" && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                    {variant === "warning" && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    )}
                    {variant === "info" && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    <span className="text-sm font-medium">{content}</span>
                </div>
            ) : (
                content
            )}
        </div>
    );
};
