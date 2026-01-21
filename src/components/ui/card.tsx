import { cn } from "@/libs/util";
import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }
export interface CardSubComponentProps extends React.HTMLAttributes<HTMLDivElement> { }

/* ================================
   Card Main Container
================================ */
function Card({ className, ...props }: CardProps) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
                className
            )}
            {...props}
        />
    );
}

/* ================================
   Card Header
================================ */
function CardHeader({ className, ...props }: CardSubComponentProps) {
    return (
        <div
            data-slot="card-header"
            className={cn("flex flex-col gap-1.5 px-6", className)}
            {...props}
        />
    );
}

/* ================================
   Card Title
================================ */
function CardTitle({ className, ...props }: CardSubComponentProps) {
    return (
        <h3
            data-slot="card-title"
            className={cn("text-lg font-semibold leading-none", className)}
            {...props}
        />
    );
}

/* ================================
   Card Description
================================ */
function CardDescription({ className, ...props }: CardSubComponentProps) {
    return (
        <p
            data-slot="card-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

/* ================================
   Card Content
================================ */
function CardContent({ className, ...props }: CardSubComponentProps) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6 py-2 flex flex-col gap-4", className)}
            {...props}
        />
    );
}

/* ================================
   Card Footer
================================ */
function CardFooter({ className, ...props }: CardSubComponentProps) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center justify-between px-6 py-3", className)}
            {...props}
        />
    );
}

/* ================================
   Export
================================ */
export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
