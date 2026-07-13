"use client";

import { ErrorState } from "@/src/presentation/ui/error-state";

export default function ModuleError({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="This module could not be prepared."
      description="No controlled record was changed. Retry the structural module route."
      retry={reset}
    />
  );
}
