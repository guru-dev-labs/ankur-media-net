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
import { ShieldAlert, Zap, Database, UserCheck } from "lucide-react";

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Risks, Edge Cases & Mitigation Strategy
          </h1>
          <p className="text-lg text-gray-600">
            A proactive approach to building a resilient and trustworthy
            product.
          </p>
        </div>

        {/* Philosophy Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <ShieldAlert size={24} />
              Our Approach to Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Identifying risks isn&apos;t about pessimism; it&apos;s a critical
              component of professional product development. By anticipating
              potential challenges, we can design a more robust system, build
              user trust, and ensure the long-term viability of the product.
              This document outlines our strategy for turning potential
              liabilities into strengths through proactive mitigation.
            </p>
          </CardContent>
        </Card>

        {/* Risk Mitigation Matrix */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Risk & Mitigation Matrix</CardTitle>
            <CardDescription>
              A prioritized breakdown of potential challenges and our
              multi-layered strategies to address them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Risk Category</TableHead>
                  <TableHead className="w-[45%]">
                    Description & Impact
                  </TableHead>
                  <TableHead className="w-[30%]">Mitigation Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium align-top">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-yellow-600" />
                      Product & UX
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <b className="text-gray-800">Alert Fatigue:</b> Users are
                    overwhelmed by too many notifications, leading them to
                    ignore all alerts and churn.
                    <br />
                    <span className="text-sm text-red-600">Impact: High</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <ul className="list-disc list-inside text-sm">
                      <li>Implement user-configurable cooldown periods.</li>
                      <li>
                        Allow setting alert severity levels (Info, Warning,
                        Critical).
                      </li>
                      <li>
                        Intelligently group related alerts into a single
                        notification.
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium align-top">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-blue-600" />
                      Technical
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <b className="text-gray-800">Data Integrity & Latency:</b>{" "}
                    Data from ad platform APIs is delayed, incomplete, or
                    inaccurate, leading to false alerts or missed anomalies.
                    <br />
                    <span className="text-sm text-red-600">Impact: High</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <ul className="list-disc list-inside text-sm">
                      <li>Implement robust data validation on ingestion.</li>
                      <li>
                        Utilize retry logic with exponential backoff for API
                        calls.
                      </li>
                      <li>
                        Display &quot;Data fresh as of...&quot; timestamps in
                        the UI to set user expectations.
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium align-top">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-green-600" />
                      User Input
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <b className="text-gray-800">
                      Illogical Rule Configuration:
                    </b>{" "}
                    Users set up triggers with impossible or nonsensical
                    conditions (e.g., &quot;Alert when CTR is below -5%&quot;).
                    <br />
                    <span className="text-sm text-orange-600">
                      Impact: Medium
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <ul className="list-disc list-inside text-sm">
                      <li>
                        Implement strict front-end and back-end validation for
                        all user inputs.
                      </li>
                      <li>Provide clear examples and helper text in the UI.</li>
                      <li>
                        (Post-MVP) Introduce &quot;Smart Suggestions&quot; based
                        on the campaign&apos;s historical data.
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium align-top">
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-blue-600" />
                      Technical
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <b className="text-gray-800">Scalability:</b> The evaluator
                    script or database cannot handle a large number of
                    concurrent users, campaigns, and triggers.
                    <br />
                    <span className="text-sm text-orange-600">
                      Impact: Medium
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <ul className="list-disc list-inside text-sm">
                      <li>
                        Architecture is built on Supabase (Postgres), which is
                        highly scalable.
                      </li>
                      <li>
                        The evaluator script is stateless and designed to run as
                        a serverless function, enabling parallel processing.
                      </li>
                      <li>
                        Implement efficient database indexing on frequently
                        queried columns.
                      </li>
                    </ul>
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
