export const observationOffsets = {
  immediate: 0,
  "24_hours": 1,
  "7_days": 7,
  "14_days": 14,
  "30_days": 30,
} as const;

export function observationDueAt(
  productionDate: Date,
  type: keyof typeof observationOffsets | "custom",
  customDate?: Date,
): Date {
  if (type === "custom") {
    if (!customDate) throw new Error("A custom observation requires a date.");
    return new Date(customDate);
  }
  const due = new Date(productionDate);
  due.setUTCDate(due.getUTCDate() + observationOffsets[type]);
  return due;
}

export function canCompleteExperiment(input: {
  conclusion?: string | null;
  result: string;
  observationCount: number;
}): boolean {
  return Boolean(
    input.conclusion?.trim() &&
    input.result !== "not_evaluated" &&
    input.observationCount > 0,
  );
}
