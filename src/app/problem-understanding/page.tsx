"use client";
import DocumentationNav from "@/components/DocumentationNav";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  User,
  Briefcase,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

const Mermaid = dynamic(() => import("@/components/MermaidDiagram"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Problem Understanding & Opportunity
          </h1>
          <p className="text-lg text-gray-600">
            Deconstructing the market need to define a valuable and viable
            product.
          </p>
        </div>

        {/* Business Context & Market Opportunity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <DollarSign size={24} />
              The Multi-Billion Dollar Problem of Wasted Ad Spend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              With global digital ad spend projected to exceed{" "}
              <strong>$667 billion</strong>, performance marketing is the engine
              of modern business growth. However, this engine is notoriously
              inefficient. According to Forrester, nearly a quarter of this
              budget—over <strong>$150 billion</strong>—is wasted annually due
              to undetected performance anomalies.
            </p>
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-700" />
              <AlertTitle className="text-yellow-800">
                The Core Insight
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                The problem is not a lack of data, but a lack of timely,
                actionable intelligence. Marketers are drowning in dashboards
                but starved for insights. Our opportunity is to bridge this gap
                by converting raw performance data into proactive, cost-saving
                alerts.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* User Personas */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Target User Personas</CardTitle>
            <CardDescription>
              Understanding the distinct needs of our initial user segments.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Briefcase />
                Priya, Agency Campaign Manager
              </h3>
              <p className="text-sm text-gray-600">
                Manages 15-20 client accounts with diverse KPIs. Her primary
                pain is the inability to manually monitor every campaign
                effectively.
              </p>
              <b className="text-sm">Job-to-be-Done:</b> &quot;Help me safeguard
              all my clients&apos; budgets and performance, so I can retain
              their business and prove my agency&apos;s value.&quot;
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User />
                David, In-House Growth Marketer
              </h3>
              <p className="text-sm text-gray-600">
                Manages a handful of high-stakes campaigns for a DTC startup.
                His primary focus is on maximizing Return on Ad Spend (ROAS).
              </p>
              <b className="text-sm">Job-to-be-Done:</b> &quot;Alert me the
              moment a key campaign becomes unprofitable, so I can take
              immediate action to protect our bottom line.&quot;
            </div>
          </CardContent>
        </Card>

        {/* Key Assumptions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Core Assumptions & Validation Plan</CardTitle>
            <CardDescription>
              The foundational hypotheses our MVP is designed to test.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hypothesis</TableHead>
                  <TableHead>How the MVP Validates It</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Value Hypothesis
                  </TableCell>
                  <TableCell>
                    Users will find enough value in rule-based alerts to
                    actively create and monitor them.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Usability Hypothesis
                  </TableCell>
                  <TableCell>
                    Users can successfully set up a meaningful trigger without
                    assistance in under 2 minutes.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Feasibility Hypothesis
                  </TableCell>
                  <TableCell>
                    We can reliably ingest (mocked) data and process triggers in
                    a timely manner using a serverless architecture.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Flow & Use Cases */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Lightbulb size={24} />
              System Logic & Key Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-4 text-gray-700">
                &quot;The campaign aims to increase user engagement by 20%
                within the first quarter.&quot;
                <br />
                &quot;Success will be measured by tracking active users and
                retention rates.&quot;
              </p>
              <div className="bg-gray-50 p-4 rounded-md flex justify-center">
                <Mermaid
                  chart={`flowchart TD\n    A[Ad Platform Data] -->|API Fetch (Hourly)| B(Metrics Database)\n    B --> C{Trigger Evaluation Script}\n    C -- Rule Match? --> D[Alert Generated]\n    D --> E(Notification Service)\n    E --> F[Email / Google Chat]\n    D --> G(Alerts Log UI)`}
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Real-World Scenarios to Address
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>
                  <b>Creative Fatigue:</b> A high-performing ad&apos;s CTR
                  suddenly drops below 2% for over 6 hours. An alert is
                  triggered for Priya to investigate and refresh the creative.
                </li>
                <li>
                  <b>Budget Overspend:</b> Due to a configuration error, a
                  campaign&apos;s daily spend is on track to exceed its $1,000
                  cap. An alert is sent when spend hits $800, giving David time
                  to pause it.
                </li>
                <li>
                  <b>Platform Glitch:</b> A specific ad set&apos;s CPM
                  inexplicably doubles. An alert is triggered, allowing the
                  manager to isolate the issue before it impacts the whole
                  campaign.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
