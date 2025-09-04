import Link from "next/link";

export default function DocumentationNav() {
  return (
    <nav className="p-4 border-b flex flex-wrap gap-4 bg-white sticky top-0 z-50">
      <Link href="/" className="font-bold text-gray-800">
        Home
      </Link>
      <span className="text-gray-300">|</span>
      <Link
        href="/problem-understanding"
        className="text-blue-600 hover:underline"
      >
        Problem Understanding
      </Link>
      <Link href="/mvp-scope" className="text-blue-600 hover:underline">
        MVP Scope
      </Link>
      <Link href="/success-metrics" className="text-blue-600 hover:underline">
        Success Metrics
      </Link>
      <Link href="/risks" className="text-blue-600 hover:underline">
        Risks & Mitigation
      </Link>
      <Link href="/rollout" className="text-blue-600 hover:underline">
        Rollout Plan
      </Link>
      <span className="text-gray-300">|</span>
      <Link href="/campaigns" className="text-green-600 hover:underline">
        Campaigns
      </Link>
      <Link href="/triggers" className="text-green-600 hover:underline">
        Triggers
      </Link>
      <Link href="/alerts" className="text-green-600 hover:underline">
        Alerts
      </Link>
    </nav>
  );
}
