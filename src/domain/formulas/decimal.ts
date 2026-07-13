const SCALE_DIGITS = 12;
const SCALE = 10n ** BigInt(SCALE_DIGITS);

export interface DecimalValue {
  readonly units: bigint;
}

export function decimal(value: string | number): DecimalValue {
  const source = String(value).trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(source))
    throw new Error("Invalid decimal value.");
  const negative = source.startsWith("-");
  const [whole = "0", fraction = ""] = source.replace("-", "").split(".");
  const padded = `${fraction}${"0".repeat(SCALE_DIGITS)}`.slice(
    0,
    SCALE_DIGITS,
  );
  const units = BigInt(whole) * SCALE + BigInt(padded);
  return { units: negative ? -units : units };
}

export function add(...values: DecimalValue[]): DecimalValue {
  return { units: values.reduce((total, value) => total + value.units, 0n) };
}

export function multiply(
  left: DecimalValue,
  right: DecimalValue,
): DecimalValue {
  return { units: (left.units * right.units) / SCALE };
}

export function divide(left: DecimalValue, right: DecimalValue): DecimalValue {
  if (right.units === 0n) throw new Error("Cannot divide by zero.");
  return { units: (left.units * SCALE) / right.units };
}

export function compare(left: DecimalValue, right: DecimalValue): number {
  return left.units < right.units ? -1 : left.units > right.units ? 1 : 0;
}

export function decimalString(
  value: DecimalValue,
  precision = SCALE_DIGITS,
): string {
  const negative = value.units < 0n;
  const absolute = negative ? -value.units : value.units;
  const whole = absolute / SCALE;
  const fraction = (absolute % SCALE).toString().padStart(SCALE_DIGITS, "0");
  const retained = fraction.slice(0, Math.max(0, precision)).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${retained ? `.${retained}` : ""}`;
}

export const oneHundred = decimal("100");
export const zero = decimal("0");

export function normalizePercentages(values: readonly string[]): string[] {
  const parsed = values.map(decimal);
  const total = add(...parsed);
  if (total.units <= 0n) throw new Error("A positive total is required.");
  const normalized = parsed.map((value) =>
    decimalString(multiply(divide(value, total), oneHundred), 6),
  );
  const subtotal = add(...normalized.map(decimal));
  const remainder = { units: oneHundred.units - subtotal.units };
  const last = normalized.at(-1);
  if (last && remainder.units !== 0n)
    normalized[normalized.length - 1] = decimalString(
      add(decimal(last), remainder),
      6,
    );
  return normalized;
}
