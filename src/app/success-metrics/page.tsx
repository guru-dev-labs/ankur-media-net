import DocumentationNav from "../../components/DocumentationNav";

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">Success Metrics</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Business Metrics</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Reduction in wasted ad spend (alerts prevent overspending)</li>
          <li>Increase in campaign ROI (timely interventions)</li>
          <li>Adoption rate: % of users setting up triggers</li>
          <li>Retention: % of users returning to manage campaigns</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">User Metrics</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Time to first alert (how quickly users get value)</li>
          <li>Alert accuracy: % of alerts that are actionable</li>
          <li>User satisfaction (feedback, NPS)</li>
          <li>Number of edge cases handled without manual intervention</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Measurement & Iteration
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Track metrics via analytics and Supabase logs</li>
          <li>Collect user feedback after each alert</li>
          <li>
            Iterate on trigger logic and notification methods based on data
          </li>
        </ul>
      </section>
    </main>
  );
}
