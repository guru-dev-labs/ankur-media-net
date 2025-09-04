import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductBriefPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Product Brief: Ad Alerts MVP
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          The central documentation for the Ad Campaign Anomaly Alerting System.
        </p>
      </div>

      {/* 1. Problem Understanding & Key Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>1. Problem Understanding & Key Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold">Problem Statement</h3>
            <p className="text-gray-700">
              Advertisers and campaign managers struggle to manually monitor ad
              campaign performance in real-time. This leads to delayed detection
              of anomalies (e.g., sudden drops in CTR, spikes in CPA), resulting
              in wasted ad spend and missed opportunities.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">Key Assumptions</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <b>Target Users:</b> Primary users are ad campaign managers and
                marketing analysts at SMBs and digital marketing agencies.
              </li>
              <li>
                <b>User Need:</b> Users need timely, accurate, and actionable
                alerts to take corrective action quickly.
              </li>
              <li>
                <b>Data Availability:</b> We can access near real-time ad
                performance data via APIs.
              </li>
              <li>
                <b>Technical Feasibility:</b> We can build a system to ingest
                data, apply detection rules, and send notifications.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 2. MVP Scope & Feature List */}
      <Card>
        <CardHeader>
          <CardTitle>2. MVP Scope & Feature List</CardTitle>
          <CardDescription>
            Focusing on the core value proposition: detect and alert.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              Core MVP Features (User Stories)
            </h3>
            <div className="p-4 border rounded-lg space-y-4">
              <div>
                <p className="font-medium">EPIC: Trigger Management</p>
                <ul className="list-disc list-inside text-gray-700 mt-1 space-y-2">
                  <li>
                    <b>As an</b> Agency Campaign Manager, <b>I want to</b>{" "}
                    create a new trigger for a specific campaign by selecting
                    the metric (e.g., CTR), setting the condition (e.g., drops
                    below), and defining a threshold (e.g., 1.5%),{" "}
                    <b>so that</b> I can automatically monitor the campaign's
                    health against its KPIs.
                  </li>
                  <li>
                    <b>As an</b> In-House Growth Marketer, <b>I want to</b> set
                    an alert if a campaign's total `Spend` goes `above` a
                    specific dollar amount (`$500`) within a single day,{" "}
                    <b>so that</b> I can prevent budget overruns and protect my
                    campaign's profitability.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium">EPIC: Alert Monitoring</p>
                <ul className="list-disc list-inside text-gray-700 mt-1">
                  <li>
                    <b>As a</b> campaign manager, <b>I want to</b> see a summary
                    of recent alerts on my main dashboard, <b>so that</b> I can
                    immediately assess which campaigns need my attention.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">MVP vs. Nice-to-Have</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Data Source Integration</TableCell>
                  <TableCell>
                    Connect to Google Ads API (mocked for MVP).
                  </TableCell>
                  <TableCell>
                    <Badge>MVP</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rule-Based Alerting</TableCell>
                  <TableCell>
                    Users can define rules and thresholds for key metrics.
                  </TableCell>
                  <TableCell>
                    <Badge>MVP</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email & Chat Notifications</TableCell>
                  <TableCell>
                    Send alerts via SendGrid and Google Chat webhook.
                  </TableCell>
                  <TableCell>
                    <Badge>MVP</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alerts Dashboard</TableCell>
                  <TableCell>
                    A simple dashboard to display a list of recent alerts.
                  </TableCell>
                  <TableCell>
                    <Badge>MVP</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ML-Powered Anomaly Detection</TableCell>
                  <TableCell>
                    Automatically identify unexpected deviations from historical
                    patterns.
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Nice-to-have</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Root Cause Analysis</TableCell>
                  <TableCell>
                    Provide insights into the potential causes of an anomaly.
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Nice-to-have</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>3. Success Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="font-semibold">Business Metrics</h3>
          <p className="text-gray-700">
            User Adoption (Active Users) and Engagement (Triggers Created).
          </p>
          <h3 className="font-semibold">User Metrics</h3>
          <p className="text-gray-700">
            Time to Detect Anomalies and Alert Accuracy (measured by user
            feedback).
          </p>
        </CardContent>
      </Card>

      {/* 4. Risks, Edge Cases & Mitigation */}
      <Card>
        <CardHeader>
          <CardTitle>4. Risks, Edge Cases & Mitigation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk / Edge Case</TableHead>
                <TableHead>Mitigation Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Alert Fatigue</TableCell>
                <TableCell>
                  Allow users to set cooldown periods and severity levels to
                  avoid too many notifications.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Data Inaccuracy</TableCell>
                <TableCell>
                  Implement data validation checks and monitor API health. Have
                  fallback mechanisms.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>False Positives</TableCell>
                <TableCell>
                  Continuously refine detection algorithms. Allow users to give
                  feedback on alert usefulness.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 5. Rollout / Experimentation Plan */}
      <Card>
        <CardHeader>
          <CardTitle>5. Rollout / Experimentation Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="list-decimal list-inside text-gray-700 space-y-1">
            <li>
              <b>Internal Alpha:</b> Test the MVP with internal users to find
              major bugs.
            </li>
            <li>
              <b>Closed Beta:</b> Invite a select group of target users to use
              the product and provide qualitative feedback.
            </li>
            <li>
              <b>Phased Rollout:</b> Gradually release new features to all
              users, monitoring key metrics.
            </li>
            <li>
              <b>A/B Testing (Post-Launch):</b> Experiment with different alert
              contents or UI flows to optimize user engagement. For example,
              test a "digest email" vs. "instant alerts" to see which has better
              user satisfaction.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
