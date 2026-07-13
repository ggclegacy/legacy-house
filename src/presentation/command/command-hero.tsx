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
          <span className="command-lab-field" />
          <span className="command-lab-orbit command-lab-orbit-wide" />
          <span className="command-lab-orbit command-lab-orbit-near" />
          <span className="command-lab-axis command-lab-axis-horizontal" />
          <span className="command-lab-axis command-lab-axis-vertical" />
          <span className="command-lab-signal command-lab-signal-left" />
          <span className="command-lab-signal command-lab-signal-right" />
        </div>
        <CommandCore />
      </div>
    </section>
  );
}
