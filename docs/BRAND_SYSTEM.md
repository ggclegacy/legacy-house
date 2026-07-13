# Legacy House Brand and Experience System

## Identity

The interface is masculine, premium, advanced, disciplined, refined, powerful, and operationally intelligent. It should feel purpose-built for a luxury men's brand—not like a themed admin template.

Root `logo.png` is the official hero icon, application emblem, and loading mark. Preserve the original bytes and aspect ratio. Never replace, redraw, overwrite, recolor, distort, crop essential artwork, or introduce a competing logo. Use descriptive alternative text when it conveys identity; use empty alt text only for a duplicate decorative instance. Derived responsive delivery formats may be evaluated in Phase 1 only if the source remains untouched and the output is visually faithful.

## Color tokens

| Role                 | Token            | Value     |
| -------------------- | ---------------- | --------- |
| Primary canvas       | Obsidian Core    | `#050506` |
| Raised surface       | Carbon Panel     | `#0D0D11` |
| Authority/action     | Deep Luxury Gold | `#C4912F` |
| Highlight            | Champagne Gold   | `#E2BE72` |
| Atmospheric depth    | Imperial Purple  | `#241038` |
| Secondary depth      | Secondary Purple | `#2A0F4A` |
| Selective highlight  | Purple Highlight | `#5A2A82` |
| Primary light text   | Bone White       | `#F1EEE7` |
| Secondary text       | Muted Steel      | `#97949F` |
| Critical/destructive | Deep Oxblood     | `#7A2E32` |
| Warning              | Antique Amber    | `#B67A2B` |
| Positive             | Muted Sage       | `#66806A` |

Legacy Reserve accents are Burnished Amber `#9A5A22`, Deep Cognac `#4A2417`, and Warm Gold `#C4912F`. Legacy Sanctum accents are Deep Amethyst `#3A1760`, Electric Plum `#61318C`, and Cool Gold `#D0A84C`.

Obsidian owns most area. Gold signals hierarchy, important actions, and decisions rather than coating every element. Purple creates depth and intelligence, not neon spectacle. Product-line accents reinforce context but never replace shared semantic status colors. Each combination must pass contrast checks; token names do not guarantee accessible pairing.

## Typography and hierarchy

Choose a restrained, legible type system in Phase 1: a distinctive display face may support major brand moments, paired with an efficient UI face for dense operational work. Prefer licensed or redistributable web fonts with documented fallbacks. Use a consistent type scale, tabular numerals for quantities/costs, readable line length, and no tiny uppercase copy as a substitute for hierarchy. Headings remain semantic and sequential.

## Layout philosophy

- Combine cinematic brand moments with precise operational density; reserve atmosphere for orientation and priority, not every screen.
- Use a consistent content grid, strong alignment, calm spacing, and restrained corner radii.
- Put record identity, lifecycle state, ownership, and primary action where users can scan them quickly.
- Progressive disclosure keeps details available without hiding critical warnings or provenance.
- Dense desktop tables need sorting/filtering context and must become readable cards, grouped rows, or deliberate horizontal regions on mobile—never page-level overflow.
- Small mobile, large mobile, tablet, laptop, and large desktop are first-class layouts.

## Home hero

The central `logo.png` acts as the intelligence core. CREATE, BUILD, CONTROL, and SCALE appear as clearly labeled icons in a refined orbital/circular composition. Restrained pulses travel from the center and pillars activate sequentially to communicate one core powering four operating systems. The static state must remain meaningful, and `prefers-reduced-motion` must remove nonessential movement. Avoid game HUDs, cheesy science fiction, random glowing rings, and unlabeled icon menus.

## Motion

Motion communicates hierarchy, state change, relationship, loading, or feedback. Favor short, subtle transitions; avoid perpetual ambient work outside the hero, excessive parallax, large flashes, or glow that reduces legibility. Preserve focus and reading position. Reduced-motion mode uses immediate transitions or gentle opacity changes and never blocks comprehension.

## Components and states

- Buttons have clear primary/secondary/destructive hierarchy, adequate targets, keyboard states, and honest disabled/loading behavior.
- Forms use persistent labels, useful descriptions, inline validation, error summaries for long forms, and preserve safe input after failure.
- Status uses text/icon plus color. Controlled transitions explain requirements and consequences.
- Cards are structural, not default wrappers for every field. Dialogs trap/restore focus and are reserved for bounded tasks.
- Tables expose units, effective dates, value classification, and provenance where relevant.
- Charts always have text summaries, labeled axes/units, accessible colors, and no fabricated data.
- Loading, empty, error, permission-denied, offline/retry, and partial-data states are intentional and actionable.
- Toasts never carry the only copy of a critical result.

## Accessibility baseline

Meet WCAG 2.2 AA as the implementation baseline: semantic landmarks, keyboard access, visible focus, logical focus order, programmatic names/errors, sufficient contrast, zoom/reflow support, touch-friendly controls, reduced motion, non-color-only meaning, and tested assistive-technology behavior for complex widgets. Use native HTML before custom primitives.

## Anti-patterns

No generic SaaS styling, bright-white dashboards, blue primary accents, gaming or crypto aesthetics, random neon/circuitry, meaningless motion, excessive glow, fake charts/metrics, stock photography, low-contrast microtext, pill-shaped everything, generic laboratory templates, invisible focus, desktop-only tables, or decorative complexity that delays operational tasks.

## Phase 1 implementation record

The implemented token values in `src/app/globals.css` are authoritative aliases of this document. The shell uses a persistent desktop sidebar, compact command bar, mobile drawer, and mobile command dock. The root asset is served directly through `/emblem`; the source is neither copied nor transformed. `LegacyHouseMark` is the only reusable application-mark primitive.

The Command page preserves the four-pillar relationship as labeled HTML even when motion is disabled. System-level reduced-motion preferences and the workspace preference both remove nonessential animation. Product-line accents identify context only; semantic success, warning, and error colors remain independent.
