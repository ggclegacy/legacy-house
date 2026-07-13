"use client";

import { useEffect } from "react";

export interface ToastMessage {
  id: number;
  title: string;
  description: string;
}

export function ToastRegion({
  toast,
  dismiss,
}: {
  toast: ToastMessage | null;
  dismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [dismiss, toast]);

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast ? (
        <div className="toast">
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.description}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
