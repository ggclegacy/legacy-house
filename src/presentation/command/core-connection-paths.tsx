import type { CommandPillarId } from "./command-hero-config";

const paths: ReadonlyArray<{
  id: CommandPillarId;
  d: string;
  terminals: readonly (readonly [number, number])[];
}> = [
  {
    id: "create",
    d: "M 428 438 L 374 438 L 332 382 L 268 382 L 218 308 L 174 226",
    terminals: [
      [374, 438],
      [268, 382],
      [174, 226],
    ],
  },
  {
    id: "build",
    d: "M 572 438 L 626 438 L 668 382 L 732 382 L 782 308 L 826 226",
    terminals: [
      [626, 438],
      [732, 382],
      [826, 226],
    ],
  },
  {
    id: "control",
    d: "M 428 562 L 374 562 L 332 618 L 268 618 L 218 692 L 174 774",
    terminals: [
      [374, 562],
      [268, 618],
      [174, 774],
    ],
  },
  {
    id: "scale",
    d: "M 572 562 L 626 562 L 668 618 L 732 618 L 782 692 L 826 774",
    terminals: [
      [626, 562],
      [732, 618],
      [826, 774],
    ],
  },
];

export function CoreConnectionPaths() {
  return (
    <svg
      className="core-connections"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="command-connection-gold"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#704b18" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#b78731" stopOpacity="0.95" />
          <stop offset="1" stopColor="#caa765" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient
          id="command-connection-energy"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#291b45" />
          <stop offset="0.48" stopColor="#6f3ca1" />
          <stop offset="1" stopColor="#c18f31" />
        </linearGradient>
        <filter
          id="command-signal-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {paths.map((path) => (
        <g className={`connection connection-${path.id}`} key={path.id}>
          <path className="connection-shadow" d={path.d} pathLength="100" />
          <path className="connection-housing" d={path.d} pathLength="100" />
          <path className="connection-rail" d={path.d} pathLength="100" />
          <path className="connection-energy" d={path.d} pathLength="100" />
          <path className="connection-signal" d={path.d} pathLength="100" />
          {path.terminals.map(([x, y], index) => (
            <g className="connection-coupler" key={`${x}-${y}`}>
              <rect x={x - 8} y={y - 8} width="16" height="16" rx="2" />
              <circle
                className={
                  index === path.terminals.length - 1
                    ? "connection-terminal"
                    : ""
                }
                cx={x}
                cy={y}
                r={index === path.terminals.length - 1 ? 4 : 2.5}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
