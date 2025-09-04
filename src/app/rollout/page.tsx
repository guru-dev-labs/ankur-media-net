import DocumentationNav from "@/components/DocumentationNav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Rocket,
  Users,
  FlaskConical,
  Lightbulb,
  ClipboardCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Rollout & Experimentation Plan
          </h1>
          <p className="text-lg text-gray-600">
            A phased strategy to launch, learn, and iterate our way to
            product-market fit.
          </p>
        </div>

        {/* Rollout Philosophy */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Rocket size={24} />
              Go-to-Market Philosophy: Learn Before We Scale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Our rollout strategy is designed to intentionally de-risk the
              product launch. Instead of a &quot;big bang&quot; release, we will
              use a phased approach that allows us to gather high-quality
              feedback from the right users at each stage. The goal is to
              validate our core value proposition with a passionate group of
              early adopters before expanding to a wider audience. This ensures
              we are building a product that people truly want and need.
            </p>
          </CardContent>
        </Card>

        {/* Phased Rollout Plan */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Phased Rollout Plan</CardTitle>
            <CardDescription>
              From internal testing to public availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phase 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-gray-200 rounded-full">
                  <ClipboardCheck className="h-6 w-6 text-gray-600" />
                </div>
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <p className="text-sm font-semibold text-gray-500">
                  PHASE 1 (DURATION: 1 WEEK)
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  Internal Alpha & Dogfooding
                </h3>
                <p className="text-gray-600 mt-1">
                  <b>Goal:</b> Identify and eliminate critical bugs, validate
                  the core user flow, and ensure system stability.
                </p>
                <p className="text-gray-600 mt-1">
                  <b>Audience:</b> Internal product and engineering team
                  members.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <p className="text-sm font-semibold text-blue-600">
                  PHASE 2 (DURATION: 2-4 WEEKS)
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  Closed Beta with &quot;Design Partners&quot;
                </h3>
                <p className="text-gray-600 mt-1">
                  <b>Goal:</b> Gather high-quality, qualitative feedback on
                  alert accuracy, usability, and perceived value from our ideal
                  user personas.
                </p>
                <p className="text-gray-600 mt-1">
                  <b>Audience:</b> A curated list of 5-10 friendly marketing
                  agencies and in-house managers who have agreed to be design
                  partners.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-600">
                  PHASE 3 (ONGOING)
                </p>
                <h3 className="text-xl font-semibold text-gray-900">
                  Public Launch & Continuous Rollout
                </h3>
                <p className="text-gray-600 mt-1">
                  <b>Goal:</b> Drive user acquisition and begin measuring
                  quantitative success metrics at scale.
                </p>
                <p className="text-gray-600 mt-1">
                  <b>Audience:</b> Open to the public via a waitlist, gradually
                  expanding access to manage server load and support capacity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experimentation Plan */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <FlaskConical size={24} />
              Post-Launch Experimentation Framework
            </CardTitle>
            <CardDescription>
              A plan for data-driven iteration to optimize our key metrics after
              launch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Core Principle</AlertTitle>
              <AlertDescription>
                Every major feature improvement will be framed as a testable
                hypothesis and, where possible, validated with an A/B test to
                ensure we are making impactful changes.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold">
                  Experiment 1: Optimizing Notification Content
                </h4>
                <ul className="list-disc list-inside text-gray-700 mt-1 text-sm">
                  <li>
                    <b>Hypothesis:</b> Including a direct link to the specific
                    ad campaign within the alert email will increase user
                    engagement and speed up their response time.
                  </li>
                  <li>
                    <b>Metric to Improve:</b> &quot;Weekly Actionable
                    Alerts&quot; (our North Star).
                  </li>
                  <li>
                    <b>Design:</b> 50/50 split test. Group A receives a generic
                    alert. Group B receives an alert with a deep link to the
                    campaign dashboard. We will measure the click-through rate
                    on the link.
                  </li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">
                  Experiment 2: Driving Trigger Creation
                </h4>
                <ul className="list-disc list-inside text-gray-700 mt-1 text-sm">
                  <li>
                    <b>Hypothesis:</b> Proactively suggesting a
                    &quot;starter&quot; trigger (e.g., a spend alert) during
                    user onboarding will increase our Activation Rate.
                  </li>
                  <li>
                    <b>Metric to Improve:</b> Activation Rate.
                  </li>
                  <li>
                    <b>Design:</b> 50/50 split test for new users. Group A sees
                    the standard empty state. Group B is prompted with a
                    pre-configured but disabled trigger they can activate in one
                    click.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
