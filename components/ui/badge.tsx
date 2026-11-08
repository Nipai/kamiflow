import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "neutral" | "info" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  children,
  ...props
}) => {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/70",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
    info: "bg-kami-50 text-kami-800 border-kami-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
