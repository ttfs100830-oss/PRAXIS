import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  size?: "md" | "lg";
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  size = "md",
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`animate-fade-up max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-sand bg-cream-50 shadow-lift scrollbar-subtle sm:rounded-2xl ${
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-sand/80 bg-cream-50/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            {eyebrow && (
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-rust-500">
                {eyebrow}
              </p>
            )}
            <h2
              id={titleId}
              className="font-display text-xl font-semibold leading-tight text-forest-900"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand text-forest-800 transition-colors hover:bg-cream-200"
          >
            <X size={17} />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 4200);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="animate-fade-up fixed bottom-5 left-1/2 z-[90] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full border border-cream-400/20 bg-forest-900 px-4 py-2.5 text-[13px] text-cream-100 shadow-lift"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-1 rounded-full p-0.5 text-cream-300/70 transition-colors hover:text-cream-50"
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </div>,
    document.body,
  );
}
