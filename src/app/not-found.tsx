import Link from "next/link";

export default function NotFound() {
  return (
    <div className="state-page">
      <p className="eyebrow">404 · Record not found</p>
      <h1>There is nothing at this address.</h1>
      <p>
        The link may be incomplete, or the requested record may no longer be
        available to you.
      </p>
      <Link className="text-link" href="/">
        Return to Legacy House
      </Link>
    </div>
  );
}
