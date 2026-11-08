import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kami-500/30 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-kami-600 text-white hover:bg-kami-700 shadow-sm hover:shadow",
      secondary:
        "bg-kami-100/70 text-kami-800 hover:bg-kami-100 border border-kami-200/60",
      outline:
        "border border-stone-200 bg-white/80 hover:bg-white text-stone-700 hover:border-stone-300 shadow-subtle",
      ghost:
        "text-stone-600 hover:text-stone-900 hover:bg-stone-100/60",
      danger:
        "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
