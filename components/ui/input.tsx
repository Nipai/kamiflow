import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-stone-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-kami-500/20 focus:border-kami-600 transition duration-150 disabled:bg-stone-50 disabled:text-stone-400",
            error && "border-rose-400 focus:ring-rose-200 focus:border-rose-500",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-stone-500">{helperText}</p>
        )}
        {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
