import Image from "next/image";

interface LegacyHouseMarkProps {
  size: number;
  decorative?: boolean;
  priority?: boolean;
  className?: string;
}

export function LegacyHouseMark({
  size,
  decorative = false,
  priority = false,
  className,
}: LegacyHouseMarkProps) {
  return (
    <Image
      src="/emblem"
      alt={decorative ? "" : "Legacy House emblem"}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
