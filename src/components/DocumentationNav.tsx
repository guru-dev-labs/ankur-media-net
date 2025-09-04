import Link from "next/link";

export default function DocumentationNav() {
  return (
    <nav className="p-4 border-b flex gap-4 bg-white">
      <Link href="/problem-understanding">Problem Understanding</Link>
      <Link href="/mvp-scope">MVP Scope</Link>
      <Link href="/success-metrics">Success Metrics</Link>
      <Link href="/risks">Risks & Mitigation</Link>
      <Link href="/rollout">Rollout Plan</Link>
      <Link href="/campaigns">Campaigns</Link>
      <Link href="/triggers">Triggers</Link>
      <Link href="/alerts">Alerts</Link>
    </nav>
  );
}
