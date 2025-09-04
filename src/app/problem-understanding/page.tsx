"use client";
import DocumentationNav from "../../components/DocumentationNav";
import dynamic from "next/dynamic";

const Mermaid = dynamic(() => import("../../components/MermaidDiagram"), {
  ssr: false,
});

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">
          Problem Understanding & Key Assumptions
        </h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Business Context</h2>
        <div className="bg-white shadow rounded p-4 mb-4 flex flex-col gap-2">
          <p>
            <span className="font-bold">Global digital ad spend in 2024:</span>{" "}
            $667 billion (Statista). Marketers rely on platforms like Meta,
            Google, and TikTok to drive growth, but performance can fluctuate
            due to platform changes, creative fatigue, budget issues, or
            technical errors.
          </p>
          <p>
            <span className="font-bold">Industry pain point:</span> 23% of ad
            budgets are wasted due to undetected anomalies (Forrester).
          </p>
          <p>
            <span className="font-bold">Why now?</span> Real-time anomaly
            detection is critical to avoid wasted spend and missed
            opportunities, especially as budgets tighten and competition
            increases.
          </p>
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-2">User Persona</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <p className="font-bold">Priya, Performance Marketing Manager</p>
          <ul className="list-disc ml-6">
            <li>Manages $2M/month ad spend across Meta and Google.</li>
            <li>
              Needs instant alerts for overspend, creative fatigue, and platform
              outages.
            </li>
            <li>
              Wants to customize rules for each campaign and get actionable
              notifications.
            </li>
            <li>Frustrated by manual monitoring and missed anomalies.</li>
          </ul>
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-2">User Needs</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Immediate, actionable alerts for anomalies.</li>
          <li>Customizable rules and thresholds per campaign.</li>
          <li>Clear, non-intrusive notifications (in-app, email, Slack).</li>
          <li>Historical anomaly tracking and reporting.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          First Principles Analysis
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            What is an anomaly? It’s a deviation from expected performance,
            which can be defined by historical data, business goals, or user-set
            thresholds.
          </li>
          <li>
            Why do anomalies matter? They can signal wasted budget, missed
            opportunities, or technical issues.
          </li>
          <li>
            How should alerts work? They must be timely, relevant, and
            actionable.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Key Assumptions</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Users have access to campaign performance data via APIs (e.g., Meta,
            Google).
          </li>
          <li>
            Users want to set their own rules for what constitutes an anomaly.
          </li>
          <li>
            Notifications should be sent via email, SMS, or in-app (MVP:
            email/in-app).
          </li>
          <li>
            System should be scalable to support many campaigns and users.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Edge Cases & Multiple POVs
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>What if data is delayed or missing from the ad platform?</li>
          <li>
            How to handle false positives (alerting too often) vs. false
            negatives (missing real issues)?
          </li>
          <li>What if a user sets conflicting or illogical rules?</li>
          <li>
            How to support both small businesses (few campaigns) and agencies
            (hundreds)?
          </li>
          <li>How to ensure alerts are actionable, not overwhelming?</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Stakeholder Perspectives & Trade-offs
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Marketers want speed and accuracy; engineers want reliability and
            scalability.
          </li>
          <li>
            Business leaders want ROI and risk mitigation; users want simplicity
            and control.
          </li>
          <li>
            Trade-off: Too many alerts = fatigue, too few = missed issues.
            Balance is key.
          </li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">System Flow Diagram</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <Mermaid
            chart={`flowchart TD\n    A[Ad Platform Data] -->|API Fetch| B[Campaign Performance DB]\n    B --> C{Trigger Rules}\n    C -->|Threshold Met| D[Alert Generated]\n    D --> E[Notification Sent]\n    C -->|Threshold Not Met| F[No Action]\n    D --> G[Alert Log]`}
          />
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Real-World Scenarios
        </h2>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Creative fatigue: CTR drops below threshold for 3 hours, alert
            triggers.
          </li>
          <li>Budget overspend: Spend exceeds daily cap, alert triggers.</li>
          <li>
            API outage: Data missing, system retries and notifies admin if
            persistent.
          </li>
        </ul>
      </section>
    </main>
  );
}
