import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="state-page">
      <p className="eyebrow">Access controlled</p>
      <h1>This area is not available.</h1>
      <p>Your current role does not grant access. No records were changed.</p>
      <Link className="text-link" href="/">
        Return to Legacy House
      </Link>
    </div>
  );
}
