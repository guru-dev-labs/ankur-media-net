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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TrendingUp,
  Target,
  Users,
  Repeat,
  BarChart,
  HardHat,
} from "lucide-react";

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Success Metrics & Measurement Framework
          </h1>
          <p>
            How we&apos;ll measure what matters: connecting user value to
            business impact.
          </p>
        </div>

        {/* North Star Metric */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Target size={24} />
              Our North Star Metric
            </CardTitle>
            <CardDescription>
              The one metric that best captures the core value we deliver to our
              users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-indigo-50 border-indigo-200">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <AlertTitle className="text-indigo-800">
                Weekly Actionable Alerts
              </AlertTitle>
              <AlertDescription className="text-indigo-700">
                <p>
                  <b>Definition:</b> The total number of alerts per week that
                  are confirmed as &quot;useful&quot; by users via in-app
                  feedback.
                </p>
                <p className="mt-2">
                  <b>Why it matters:</b> This metric is our compass. It measures
                  not just activity (alerts fired) but value delivered (alerts
                  that led to insight or action). Growing this number is a
                  direct proxy for saving our users time and money, aligning our
                  product&apos;s success with our customers&apos; success.
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Leading Indicators */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Product Health Metrics (Leading Indicators)</CardTitle>
            <CardDescription>
              These metrics measure user engagement and help us predict future
              success. They tell us if we are building the product right.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Measures...</TableHead>
                  <TableHead>MVP Goal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Activation Rate</TableCell>
                  <TableCell>
                    The user&apos;s &quot;aha!&quot; moment: setting up their
                    first functional trigger.
                  </TableCell>
                  <TableCell>
                    {"≥"} 60% of new users create a trigger within 24 hours.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Time to First Value (TTFV)
                  </TableCell>
                  <TableCell>
                    How quickly we deliver on our core promise after setup.
                  </TableCell>
                  <TableCell>
                    Median time from trigger creation to first alert is {"<"} 12
                    hours.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Feature Adoption
                  </TableCell>
                  <TableCell>
                    Usage of different metrics (CTR, Spend, etc.) and
                    notification channels.
                  </TableCell>
                  <TableCell>
                    No single metric should have {"<"} 10% adoption.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Lagging Indicators */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Business Impact Metrics (Lagging Indicators)</CardTitle>
            <CardDescription>
              These metrics measure the overall health and viability of the
              business. They tell us if we are building the right product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Measures...</TableHead>
                  <TableHead>How We&apos;ll Measure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    User Retention (Cohort)
                  </TableCell>
                  <TableCell>
                    The product&apos;s stickiness and long-term value.
                  </TableCell>
                  <TableCell>
                    Track Week 1 ({"≥"}40%) and Week 4 ({"≥"}20%) retention for
                    new user cohorts.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Proxy for ROI</TableCell>
                  <TableCell>
                    The ultimate value prop: saving users time and money.
                  </TableCell>
                  <TableCell>
                    Qualitative user interviews and surveys asking: &quot;Has Ad
                    Alerts helped you catch an issue that saved you money?&quot;
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Measurement & Iteration */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Repeat size={24} />
              Measurement & Iteration Loop
            </CardTitle>
            <CardDescription>
              Our framework for turning data into product improvements.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">1. Measure</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Track quantitative metrics via Supabase logs and product
                  analytics.
                </p>
              </div>
              <div className="text-2xl text-gray-300 hidden md:block">→</div>
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">2. Learn</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Gather qualitative insights from user interviews and in-app
                  feedback prompts.
                </p>
              </div>
              <div className="text-2xl text-gray-300 hidden md:block">→</div>
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-purple-100 rounded-full">
                  <HardHat className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">3. Build</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Prioritize roadmap based on data-driven hypotheses to improve
                  key metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
