import DocumentationNav from "../../components/DocumentationNav";

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Risks, Edge Cases & Mitigation
        </h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Risks & Edge Cases</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Data latency or missing data from ad platforms</li>
          <li>False positives: alerting too often, causing alert fatigue</li>
          <li>False negatives: missing real anomalies</li>
          <li>Users setting illogical or conflicting rules</li>
          <li>Scalability: supporting many users/campaigns</li>
          <li>Security: unauthorized access to campaign data</li>
          <li>Notification delivery failures (email/SMS issues)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Mitigation Strategies
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Graceful handling of missing/delayed data (retry, fallback)</li>
          <li>Rate limiting and smart alert grouping to reduce fatigue</li>
          <li>Validation of trigger rules on creation</li>
          <li>Monitoring system health and alert delivery</li>
          <li>Role-based access and secure data storage</li>
          <li>Scalable architecture (Supabase, serverless functions)</li>
        </ul>
      </section>
    </main>
  );
}
