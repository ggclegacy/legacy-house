import { CommandCore } from "@/src/presentation/components/command-core";

import { commandPillars } from "./command-hero-config";
import { CoreConnectionPaths } from "./core-connection-paths";
import { PillarNode } from "./pillar-node";

export function CommandHero() {
  return (
    <section className="command-hero" aria-labelledby="command-hero-title">
      <header className="command-hero-identity">
        <h1 id="command-hero-title">Legacy House</h1>
        <p>Groomed Gent Co. Product Intelligence OS</p>
      </header>
      <div
        className="command-stage"
        aria-label="Legacy House intelligence core connects Create, Build, Control, and Scale"
      >
        <CoreConnectionPaths />
        <CommandCore />
        {commandPillars.map((pillar) => (
          <PillarNode key={pillar.id} {...pillar} />
        ))}
      </div>
    </section>
  );
}
