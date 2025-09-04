import DocumentationNav from "../../components/DocumentationNav";

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">MVP Scope & Feature List</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">MVP Features</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>User authentication (Supabase Auth)</li>
          <li>Campaigns dashboard: list, view, and basic metrics</li>
          <li>Trigger rules: create, edit, activate/deactivate</li>
          <li>Alerting: log and display alerts when triggers fire</li>
          <li>Simple notification (in-app, MVP: email optional)</li>
          <li>Basic navigation and documentation pages</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Nice-to-Have Features
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Advanced notification channels (SMS, Slack, webhook)</li>
          <li>Historical anomaly detection (ML-based)</li>
          <li>Bulk rule management for agencies</li>
          <li>Customizable alert templates/messages</li>
          <li>Role-based access (admin, viewer)</li>
          <li>Integration with multiple ad platforms (Meta, Google, TikTok)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Rationale & Trade-offs
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            MVP focuses on core value: timely, actionable alerts for campaign
            anomalies.
          </li>
          <li>
            Advanced features are deferred to keep scope realistic and ensure
            rapid iteration.
          </li>
          <li>Design is modular to allow easy future expansion.</li>
        </ul>
      </section>
    </main>
  );
}
