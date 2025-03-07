import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant="primary"
                className={cn("w-full py-6 text-base font-semibold rounded-lg", className)}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

PrimaryButton.displayName = "PrimaryButton";
