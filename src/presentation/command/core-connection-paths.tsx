import type { CommandPillarId } from "./command-hero-config";

const paths: ReadonlyArray<{
  id: CommandPillarId;
  d: string;
  terminal: readonly [number, number];
}> = [
  {
    id: "create",
    d: "M 500 500 C 430 465 390 295 180 180",
    terminal: [180, 180],
  },
  {
    id: "build",
    d: "M 500 500 C 570 465 610 295 820 180",
    terminal: [820, 180],
  },
  {
    id: "control",
    d: "M 500 500 C 430 535 390 705 180 820",
    terminal: [180, 820],
  },
  {
    id: "scale",
    d: "M 500 500 C 570 535 610 705 820 820",
    terminal: [820, 820],
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
          <stop offset="0" stopColor="#5a2a82" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#c4912f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e2be72" stopOpacity="0.45" />
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
          <path className="connection-rail" d={path.d} pathLength="100" />
          <path className="connection-signal" d={path.d} pathLength="100" />
          <circle
            className="connection-terminal"
            cx={path.terminal[0]}
            cy={path.terminal[1]}
            r="5"
          />
        </g>
      ))}
    </svg>
  );
}
