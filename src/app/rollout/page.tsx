import DocumentationNav from "../../components/DocumentationNav";

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Rollout / Experimentation Plan
        </h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Rollout Strategy</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Pilot launch with a small group of marketers/agencies</li>
          <li>Collect feedback on alert accuracy, usability, and value</li>
          <li>Iterate on trigger logic and notification methods</li>
          <li>Expand to broader user base after initial validation</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Experimentation Plan
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>A/B test different alert formats and notification channels</li>
          <li>Measure impact on campaign performance and user engagement</li>
          <li>Track edge cases and system reliability</li>
          <li>Use analytics to guide feature prioritization</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Iteration & Scaling</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Rapid iteration based on user feedback and metrics</li>
          <li>Scale infrastructure as user base grows</li>
          <li>Continuously monitor for new risks and edge cases</li>
        </ul>
      </section>
    </main>
  );
}
