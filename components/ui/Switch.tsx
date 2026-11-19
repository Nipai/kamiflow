"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      name,
      checked: controlledChecked,
      defaultChecked = false,
      disabled = false,
      onChange,
      onCheckedChange,
      className,
      label,
      description,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const nextChecked = e.target.checked;
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      onChange?.(e);
      onCheckedChange?.(nextChecked);
    };

    const switchVisual = (
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-kami-500 focus-within:ring-offset-2",
          checked ? "bg-kami-600" : "bg-stone-300/80 hover:bg-stone-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    );

    const toggleElement = (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer select-none",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
          aria-label={ariaLabel}
          {...props}
        />
        {switchVisual}
      </label>
    );

    if (!label && !description) {
      return toggleElement;
    }

    return (
      <div className="flex items-start gap-3 select-none">
        {toggleElement}
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "text-xs sm:text-sm font-medium text-stone-800 cursor-pointer leading-tight",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span
              className={cn(
                "text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed",
                disabled && "opacity-50"
              )}
            >
              {description}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = "Switch";
