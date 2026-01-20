import React from 'react';
import { cn } from '../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "glass rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-white/20",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn("font-semibold leading-none tracking-tight text-xl gradient-text", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
}
