"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { asRoute } from "@/src/navigation/as-route";

interface ProductBuildNavigationProps {
  productSlug: string;
  developmentPath: string;
}

export function ProductBuildNavigation({
  productSlug,
  developmentPath,
}: ProductBuildNavigationProps) {
  const [current, setCurrent] = useState("overview");

  useEffect(() => {
    function readHash() {
      setCurrent(window.location.hash.slice(1) || "overview");
    }
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  const formulaLabel =
    developmentPath === "custom_formula" ? "Formula" : "Source";
  const formulaHref =
    developmentPath === "custom_formula" ? "#formulas" : "#sourcing";
  const contextual = (module: string) =>
    asRoute(`/modules/${module}?product=${encodeURIComponent(productSlug)}`);
  const destinations = [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "product-brief", label: "Product Brief", href: "#product-brief" },
    { id: "research", label: "Research", href: contextual("r-and-d") },
    { id: formulaHref.slice(1), label: formulaLabel, href: formulaHref },
    { id: "sourcing", label: "Sourcing", href: "#sourcing" },
    { id: "packaging", label: "Packaging", href: contextual("packaging") },
    { id: "costing", label: "Costing", href: contextual("costing") },
    { id: "documents", label: "Documents", href: "#documents" },
    { id: "decisions", label: "Decisions", href: "#decisions" },
  ];

  return (
    <nav
      className="product-build-navigation"
      aria-label="Product build navigation"
    >
      <span className="product-build-context">
        Build · {productSlug.replaceAll("-", " ")}
      </span>
      <div className="product-build-rail">
        {destinations.map((destination) => (
          <Link
            key={`${destination.label}-${destination.href}`}
            href={destination.href as Parameters<typeof Link>[0]["href"]}
            aria-current={current === destination.id ? "location" : undefined}
            onClick={() => {
              if (destination.href.startsWith("#")) setCurrent(destination.id);
            }}
          >
            {destination.label}
          </Link>
        ))}
        <span
          aria-disabled="true"
          title="Available when Launch workflows are implemented"
        >
          Launch Readiness · Unavailable
        </span>
      </div>
    </nav>
  );
}
