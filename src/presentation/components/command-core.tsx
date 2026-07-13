import Image from "next/image";

import commandIcon from "../../../icon.png";

export function CommandCore() {
  return (
    <div className="intelligence-core">
      <div className="command-core-halo" aria-hidden="true" />
      <svg
        className="command-core-rings"
        viewBox="0 0 600 600"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="core-brushed-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#704b18" />
            <stop offset="0.28" stopColor="#c18f31" />
            <stop offset="0.48" stopColor="#9e7025" />
            <stop offset="0.7" stopColor="#caa765" />
            <stop offset="1" stopColor="#704b18" />
          </linearGradient>
          <radialGradient id="core-purple-energy">
            <stop offset="0" stopColor="#6b3b8d" stopOpacity="0.58" />
            <stop offset="0.5" stopColor="#291b45" stopOpacity="0.3" />
            <stop offset="1" stopColor="#170c20" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          className="command-core-energy-disc"
          cx="300"
          cy="300"
          r="206"
        />
        <g className="command-core-ring-command">
          <circle
            className="command-core-ring-base"
            cx="300"
            cy="300"
            r="276"
          />
          <circle
            className="command-core-ring-ticks"
            cx="300"
            cy="300"
            r="265"
            pathLength="180"
          />
          <path
            className="command-core-arc command-core-arc-a"
            d="M 78 236 A 230 230 0 0 1 198 98"
          />
          <path
            className="command-core-arc command-core-arc-b"
            d="M 364 80 A 230 230 0 0 1 511 223"
          />
          <path
            className="command-core-arc command-core-arc-c"
            d="M 522 362 A 230 230 0 0 1 386 513"
          />
          <path
            className="command-core-arc command-core-arc-d"
            d="M 238 522 A 230 230 0 0 1 86 386"
          />
        </g>
        <g className="command-core-ring-counter">
          <circle
            className="command-core-ring-fine"
            cx="300"
            cy="300"
            r="232"
            pathLength="120"
          />
          <circle
            className="command-core-ring-segments"
            cx="300"
            cy="300"
            r="218"
            pathLength="100"
          />
        </g>
        <circle className="command-core-aperture" cx="300" cy="300" r="190" />
        <g className="command-core-calibration">
          <path d="M300 22v30M300 548v30M22 300h30M548 300h30" />
          <path d="M103 103l20 20M477 477l20 20M497 103l-20 20M123 477l-20 20" />
        </g>
      </svg>
      <div className="core-reactor-frame">
        <span
          className="command-core-notch command-core-notch-north"
          aria-hidden="true"
        />
        <span
          className="command-core-notch command-core-notch-east"
          aria-hidden="true"
        />
        <span
          className="command-core-notch command-core-notch-south"
          aria-hidden="true"
        />
        <span
          className="command-core-notch command-core-notch-west"
          aria-hidden="true"
        />
        <div className="core-emblem">
          <span className="core-energy" aria-hidden="true" />
          <Image
            src={commandIcon}
            alt="Legacy House emblem"
            width={2000}
            height={2000}
            sizes="(max-width: 700px) 68vw, (max-width: 1100px) 44vw, 24rem"
            priority
            className="command-core-emblem"
          />
        </div>
      </div>
    </div>
  );
}
