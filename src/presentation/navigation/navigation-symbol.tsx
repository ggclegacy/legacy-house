export function NavigationSymbol({ label }: { label: string }) {
  return (
    <span className="navigation-symbol" aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  );
}
