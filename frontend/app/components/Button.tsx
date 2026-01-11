"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
