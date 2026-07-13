"use client";

export function ErrorState({
  title,
  description,
  retry,
}: {
  title: string;
  description: string;
  retry: () => void;
}) {
  return (
    <div className="state-page" role="alert">
      <p className="eyebrow">System interruption</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <button className="button" type="button" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
