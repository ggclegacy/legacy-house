import { CommandHero } from "@/src/presentation/command/command-hero";
import { CostingMarginStudio } from "@/src/presentation/command/costing-margin-studio";
import { DevelopmentPortfolio } from "@/src/presentation/command/development-portfolio";
import { LaunchReadiness } from "@/src/presentation/command/launch-readiness";
import { ProductBuildWorkspace } from "@/src/presentation/command/product-build-workspace";
import { ProductMemory } from "@/src/presentation/command/product-memory";
import { ResearchFormulaLab } from "@/src/presentation/command/research-formula-lab";
import { SourcingPackagingNetwork } from "@/src/presentation/command/sourcing-packaging-network";
import { buildDevelopmentPortfolioModel } from "@/src/services/command/development-portfolio";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";

export default async function HomePage() {
  const [snapshot, commercial] = await Promise.all([
    loadDevelopmentSnapshot(),
    loadCommercialSnapshot(),
  ]);
  const portfolio = buildDevelopmentPortfolioModel(snapshot, commercial);
  return (
    <div className="command-page">
      <CommandHero />

      <ProductBuildWorkspace development={snapshot} commercial={commercial} />
      <DevelopmentPortfolio model={portfolio} />
      <ResearchFormulaLab development={snapshot} />
      <SourcingPackagingNetwork
        development={snapshot}
        commercial={commercial}
      />
      <CostingMarginStudio development={snapshot} commercial={commercial} />
      <ProductMemory development={snapshot} commercial={commercial} />
      <LaunchReadiness development={snapshot} commercial={commercial} />
      <footer>
        <p>Legacy House</p>
        <p>Private operating system · Groomed Gent Co.</p>
      </footer>
    </div>
  );
}
