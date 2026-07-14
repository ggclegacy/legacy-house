import { CommandCore } from "@/src/presentation/components/command-core";

export function CommandHero() {
  return (
    <section className="command-hero" aria-labelledby="command-hero-title">
      <header className="command-hero-identity">
        <h1 id="command-hero-title">Legacy House</h1>
        <p>Groomed Gent Co. Product Intelligence OS</p>
      </header>
      <div
        className="command-stage"
        aria-label="Legacy House product intelligence command core"
      >
        <div className="command-chamber" aria-hidden="true">
          <svg
            className="command-lab-drawing"
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="command-lab-measurements">
              <path d="M92 350H346M854 350h254" />
              <path d="M212 326v48M988 326v48" />
              <path d="M130 338v24m40-18v12m40-18v24m40-18v12m40-18v24" />
              <path d="M910 338v24m40-18v12m40-18v24m40-18v12m40-18v24" />
            </g>
            <g className="command-lab-molecule">
              <path d="m116 154 45-26 45 26v52l-45 26-45-26Z" />
              <path d="m206 154 45-26 45 26v52l-45 26-45-26" />
              <circle cx="116" cy="154" r="3" />
              <circle cx="296" cy="206" r="3" />
            </g>
            <g className="command-lab-formula">
              <path d="M925 143h150M925 165h102M925 187h126" />
              <path d="M895 130v70M1105 130v70" />
            </g>
            <g className="command-lab-radial">
              <circle cx="600" cy="350" r="292" />
              <path d="M600 42v42M600 616v42M292 350h42M866 350h42" />
              <path d="m382 132 30 30m376 376 30 30m0-436-30 30M412 538l-30 30" />
            </g>
          </svg>
          <span className="command-lab-reference command-lab-reference-left">
            04.7 / 12
          </span>
          <span className="command-lab-reference command-lab-reference-right">
            LH / CORE
          </span>
        </div>
        <CommandCore />
      </div>
    </section>
  );
}
