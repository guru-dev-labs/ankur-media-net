import DocumentationNav from "../components/DocumentationNav";

export default function Home() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Ad Campaign Alerts MVP</h1>
        <p className="mb-6 text-lg">
          A product management case study and working prototype for anomaly
          alerting in ad campaign performance.
        </p>
        <div className="grid gap-4">
          <a
            href="/problem-understanding"
            className="block p-4 border rounded hover:bg-gray-50"
          >
            Problem Understanding & Key Assumptions
          </a>
          <a
            href="/mvp-scope"
            className="block p-4 border rounded hover:bg-gray-50"
          >
            MVP Scope & Feature List
          </a>
          <a
            href="/success-metrics"
            className="block p-4 border rounded hover:bg-gray-50"
          >
            Success Metrics
          </a>
          <a
            href="/risks"
            className="block p-4 border rounded hover:bg-gray-50"
          >
            Risks, Edge Cases & Mitigation
          </a>
          <a
            href="/rollout"
            className="block p-4 border rounded hover:bg-gray-50"
          >
            Rollout / Experimentation Plan
          </a>
          <a
            href="/campaigns"
            className="block p-4 border rounded hover:bg-blue-50"
          >
            Campaigns
          </a>
          <a
            href="/triggers"
            className="block p-4 border rounded hover:bg-blue-50"
          >
            Triggers
          </a>
          <a
            href="/alerts"
            className="block p-4 border rounded hover:bg-blue-50"
          >
            Alerts
          </a>
        </div>
      </section>
    </main>
  );
}
