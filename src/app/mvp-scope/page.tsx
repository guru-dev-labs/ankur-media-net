import DocumentationNav from "../../components/DocumentationNav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Puzzle, Rocket, GitBranch, Scale } from "lucide-react";

export default function Page() {
  return (
    <main>
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            MVP Scope & Product Roadmap
          </h1>
          <p className="text-lg text-gray-600">
            Defining what we build now, what we build next, and why.
          </p>
        </div>

        {/* Scope Philosophy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle size={24} />
              MVP Scope Philosophy: Validate the Core Loop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              The primary goal of this MVP is to prove one critical hypothesis:
              <strong>
                If we provide marketers with timely, rule-based alerts, they
                will be able to reduce wasted ad spend and save time.
              </strong>
              Every feature included in this scope is directly aimed at
              validating this core user journey: Onboard → Configure → Monitor →
              Alert. We are intentionally deferring complexity such as
              multi-platform integrations and machine learning to ensure we can
              rapidly build, launch, and learn from a focused, high-value
              product.
            </p>
          </CardContent>
        </Card>

        {/* MVP Feature Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket size={24} />
              MVP Feature Breakdown
            </CardTitle>
            <CardDescription>
              Mapping features to the user stories they enable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>User Story Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Campaign Management
                  </TableCell>
                  <TableCell>
                    <b>As a</b> campaign manager, <b>I want to</b> add my ad
                    campaigns to the system, <b>so that</b> I can begin
                    monitoring them.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Rule-Based Trigger Engine
                  </TableCell>
                  <TableCell>
                    <b>As a</b> marketer, <b>I want to</b> create a custom rule
                    (e.g., Alert when Spend {">"} $500), <b>so that</b> the
                    system monitors what{"'"}s most important to me.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Backend Evaluator Script Cannot detect &apos;unknown
                    unknowns&apos;—anomalies that a user hasn&apos;t predicted
                    with a rule.
                    <b>As a user,</b> <b>I expect</b> the system to
                    automatically check my campaigns against my rules,{" "}
                    <b>so that</b> I don{"'"}t have to do it manually.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Email & Chat Notifications
                  </TableCell>
                  <TableCell>
                    <b>As a busy manager,</b> <b>I want to</b> be notified
                    outside of the app when an issue occurs, <b>so that</b> I
                    can take immediate action.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Future Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={24} />
              Post-MVP Roadmap: The Path to Intelligence
            </CardTitle>
            <CardDescription>
              A phased approach to expanding the product{"'"}s value
              proposition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  V2: Enhanced Intelligence & Workflow
                </h3>
                <ul className="list-disc ml-6 mt-1 text-gray-700">
                  <li>
                    <b>ML-Powered Anomaly Detection:</b> Move beyond simple
                    rules to automatically detect unusual patterns based on
                    historical data.
                  </li>
                  <li>
                    <b>Advanced Notification Channels:</b> Integrate with Slack
                    and provide webhooks for custom workflows.
                  </li>
                  <li>
                    <b>Root Cause Suggestions:</b> Offer initial hypotheses for
                    why an anomaly occurred (e.g., {"'"}Change in creative
                    detected{"'"}).
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">
                  V3: Platform Expansion & Collaboration
                </h3>
                <ul className="list-disc ml-6 mt-1 text-gray-700">
                  <li>
                    <b>Multi-Platform Integration:</b> Connect to Meta, Google,
                    and TikTok Ads for a unified view.
                  </li>
                  <li>
                    <b>Team-Based Features:</b> Introduce role-based access
                    control (Admin, Viewer) and collaborative alert resolution.
                  </li>
                  <li>
                    <b>Customizable Dashboards:</b> Allow users to build their
                    own views of campaign health and alert history.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rationale & Trade-offs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale size={24} />
              Strategic Trade-offs
            </CardTitle>
            <CardDescription>
              Justifying our MVP scope decisions to maximize learning while
              minimizing risk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Guiding Principle</AlertTitle>
              <AlertDescription>
                Our primary trade-off is choosing{" "}
                <strong>speed-to-feedback</strong> over a comprehensive feature
                set. A working, focused prototype allows us to learn from real
                users faster.
              </AlertDescription>
            </Alert>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Decision</TableHead>
                  <TableHead>Benefit</TableHead>
                  <TableHead>Trade-off</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Single Data Source (Mocked)</TableCell>
                  <TableCell>
                    Allows focus on perfecting the core alerting logic without
                    API complexities.
                  </TableCell>
                  <TableCell>
                    The MVP cannot be used with live, real-world data from
                    multiple platforms.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manual Rules Only (No ML)</TableCell>
                  <TableCell>
                    Delivers immediate, predictable value to users and is
                    simpler to implement.
                  </TableCell>
                  <TableCell>
                    Cannot detect {"'"}unknown unknowns{"'"}—anomalies that a
                    user hasn{"'"}t predicted with a rule.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Basic Email/Chat Notifications</TableCell>
                  <TableCell>
                    Fastest way to deliver out-of-app value. Validates the need
                    for external alerts.
                  </TableCell>
                  <TableCell>
                    Does not integrate into advanced user workflows (e.g., Slack
                    for agency teams).
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
