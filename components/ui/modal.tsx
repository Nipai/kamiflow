"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        data-testid="modal-backdrop"
      />

      {/* Bottom Sheet on mobile (< sm) / Centered Modal on desktop (>= sm) */}
      <div
        className={cn(
          "relative w-full sm:max-w-lg bg-white rounded-t-[2rem] sm:rounded-3xl shadow-floating border border-stone-100 overflow-hidden z-10 animate-in slide-in-from-bottom duration-200 sm:zoom-in-95 max-h-[92vh] flex flex-col pb-[max(1rem,env(safe-area-inset-bottom))]",
          className
        )}
      >
        {/* Mobile bottom sheet grab handle */}
        <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-medium text-stone-900">{title}</h3>
            {description && (
              <p className="text-xs text-stone-500 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
