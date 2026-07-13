"use client";

import { ErrorState } from "@/src/presentation/ui/error-state";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Legacy House could not complete that request."
      description="Your data was not silently changed. Try the request again."
      retry={reset}
    />
  );
}
