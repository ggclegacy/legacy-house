"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { navigationDestinations } from "@/src/navigation/navigation-registry";
import { LegacyHouseMark } from "@/src/presentation/brand/legacy-house-mark";
import { CreateDialog } from "@/src/presentation/command/create-dialog";
import { NavigationSymbol } from "@/src/presentation/navigation/navigation-symbol";
import { useWorkspace } from "@/src/presentation/providers/workspace-provider";
import { SearchDialog } from "@/src/presentation/search/search-dialog";
import { SystemStatusBadge } from "@/src/presentation/ui/system-status-badge";
import {
  ToastRegion,
  type ToastMessage,
} from "@/src/presentation/ui/toast-region";

const groups = [
  "Command",
  "Create",
  "Build",
  "Control",
  "Scale",
  "System",
] as const;

function NavigationList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="primary-navigation" aria-label="Primary navigation">
      {groups.map((group) => {
        const destinations = navigationDestinations.filter(
          (destination) => destination.group === group,
        );
        if (!destinations.length) return null;
        return (
          <section
            className="navigation-group"
            key={group}
            aria-labelledby={`nav-${group}`}
          >
            <h2 id={`nav-${group}`}>{group}</h2>
            <ul>
              {destinations.map((destination) => {
                const current =
                  destination.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(destination.href);
                return (
                  <li key={destination.id}>
                    <Link
                      href={destination.href as Route}
                      aria-current={current ? "page" : undefined}
                      onClick={onNavigate}
                      title={destination.label}
                    >
                      <NavigationSymbol label={destination.label} />
                      <span>{destination.label}</span>
                      {destination.phase > 1 ? (
                        <small
                          aria-label={`${destination.phase <= 2 && destination.id !== "documents" ? "Built in" : "Planned for"} Phase ${destination.phase}`}
                        >
                          P{destination.phase}
                        </small>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, updatePreference } = useWorkspace();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const current = useMemo(
    () =>
      navigationDestinations.find((destination) =>
        destination.href === "/"
          ? pathname === "/"
          : pathname.startsWith(destination.href),
      ) ?? navigationDestinations[0],
    [pathname],
  );

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLocaleLowerCase() === "j"
      ) {
        event.preventDefault();
        setCreateOpen(true);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    const handleCreate = () => setCreateOpen(true);
    window.addEventListener("legacy:create", handleCreate);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      window.removeEventListener("legacy:create", handleCreate);
    };
  }, []);

  return (
    <div
      className={`workspace-shell${settings.sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <aside className="desktop-sidebar">
        <Link
          className="sidebar-brand"
          href="/"
          aria-label="Legacy House Command"
        >
          <LegacyHouseMark size={44} decorative />
          <span>
            <strong>Legacy</strong> House<small>Product Intelligence OS</small>
          </span>
        </Link>
        <div className="product-context">
          <span>Product-line context</span>
          <strong>All product lines</strong>
          <small>Legacy Reserve · Legacy Sanctum</small>
        </div>
        <NavigationList pathname={pathname} />
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() =>
            updatePreference("sidebarCollapsed", !settings.sidebarCollapsed)
          }
          aria-label={
            settings.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-expanded={!settings.sidebarCollapsed}
        >
          <span aria-hidden="true">
            {settings.sidebarCollapsed ? "→" : "←"}
          </span>
          <span>Collapse</span>
        </button>
      </aside>

      <header className="command-bar">
        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setMobileNavigationOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileNavigationOpen}
        >
          ☰
        </button>
        <div className="current-section">
          <span>{current.group}</span>
          <strong>{current.label}</strong>
        </div>
        <div className="command-actions">
          <button
            className="command-trigger search-trigger"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            <span aria-hidden="true">⌕</span>
            <span>Search</span>
            <kbd>⌘ K</kbd>
          </button>
          <button
            className="command-trigger create-trigger"
            type="button"
            onClick={() => setCreateOpen(true)}
          >
            <span aria-hidden="true">＋</span>
            <span>Create</span>
            <kbd>⌘ J</kbd>
          </button>
          <SystemStatusBadge />
        </div>
      </header>

      <div
        className={`mobile-navigation-layer${mobileNavigationOpen ? "open" : ""}`}
        aria-hidden={!mobileNavigationOpen}
      >
        <button
          className="drawer-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavigationOpen(false)}
        />
        <aside className="mobile-drawer" aria-label="Mobile navigation drawer">
          <div className="drawer-heading">
            <Link href="/" onClick={() => setMobileNavigationOpen(false)}>
              <LegacyHouseMark size={42} decorative />
              <span>
                <strong>Legacy</strong> House
              </span>
            </Link>
            <button
              type="button"
              className="icon-button"
              onClick={() => setMobileNavigationOpen(false)}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>
          <div className="product-context">
            <span>Product-line context</span>
            <strong>All product lines</strong>
          </div>
          <NavigationList
            pathname={pathname}
            onNavigate={() => setMobileNavigationOpen(false)}
          />
        </aside>
      </div>

      <main id="main-content" className="workspace-main">
        {children}
      </main>
      <nav className="mobile-command-dock" aria-label="Mobile commands">
        <button type="button" onClick={() => setSearchOpen(true)}>
          <span aria-hidden="true">⌕</span>Search
        </button>
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
          <span aria-hidden="true">⌂</span>Command
        </Link>
        <button type="button" onClick={() => setCreateOpen(true)}>
          <span aria-hidden="true">＋</span>Create
        </button>
      </nav>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(name) =>
          setToast({
            id: Date.now(),
            title: "Product line created",
            description: `${name} is now available in Legacy House.`,
          })
        }
      />
      <ToastRegion toast={toast} dismiss={dismissToast} />
    </div>
  );
}
