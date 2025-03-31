import React from "react";
import {cn} from "@/lib/utils";

export const ErrorMessage = ({ text, className }: { text: string, className?: string }) => {
    return (
        <div className={cn("bg-destructive/10 border border-destructive text-destructive p-3 rounded-md mb-4 text-sm", className)}>
            {text}
        </div>
    );
};
