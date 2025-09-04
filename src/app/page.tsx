import Link from "next/link";
import DocumentationNav from "../components/DocumentationNav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Rocket,
  TrendingUp,
  ShieldAlert,
  Milestone,
  LayoutGrid,
  Database,
  Zap,
  BellRing,
  ArrowRight,
} from "lucide-react";

const documentationLinks = [
  {
    href: "/problem-understanding",
    title: "Problem Understanding",
    description: "The 'Why': Market, User Personas, and Key Assumptions.",
    Icon: BookOpen,
  },
  {
    href: "/mvp-scope",
    title: "MVP Scope & Roadmap",
    description: "The 'What': Defining the MVP, features, and future vision.",
    Icon: Rocket,
  },
  {
    href: "/success-metrics",
    title: "Success Metrics",
    description: "The 'How': Measuring success with a clear framework.",
    Icon: TrendingUp,
  },
  {
    href: "/risks",
    title: "Risks & Mitigation",
    description: "The 'What If': A proactive plan for potential challenges.",
    Icon: ShieldAlert,
  },
  {
    href: "/rollout",
    title: "Rollout & Experimentation",
    description: "The 'When': A phased GTM strategy to launch and learn.",
    Icon: Milestone,
  },
];

const prototypeLinks = [
  {
    href: "/campaigns",
    title: "Campaigns",
    description: "Manage the ad campaigns you want to monitor.",
    Icon: Database,
  },
  {
    href: "/triggers",
    title: "Triggers",
    description: "Create and manage the automated monitoring rules.",
    Icon: Zap,
  },
  {
    href: "/alerts",
    title: "Alerts",
    description: "View a log of all triggered alerts.",
    Icon: BellRing,
  },
];

interface NavLinkProps {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const NavLink = ({ href, title, description, Icon }: NavLinkProps) => (
  <Link href={href} passHref>
    <div className="group flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:bg-slate-50 hover:shadow-sm hover:border-blue-300">
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-gray-500 group-hover:text-blue-600" />
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  </Link>
);

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Ad Alerts MVP
          </h1>
          <p className="text-xl text-gray-600">
            A Product Management Case Study & Working Prototype
          </p>
          <p>
            Made with ♥ by{" "}
            <a
              href="https://www.linkedin.com/in/ankuraagarwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              Ankur Agarwal
            </a>
          </p>
        </div>

        <Separator />

        {/* Documentation Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen size={24} />
              Product Documentation
            </CardTitle>
            <CardDescription>
              The strategic thinking behind the prototype, detailing the
              problem, solution, and go-to-market plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {documentationLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </CardContent>
        </Card>

        {/* Prototype Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <LayoutGrid size={24} />
              Working Prototype
            </CardTitle>
            <CardDescription>
              Interact with the core features of the Ad Alerts application.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {prototypeLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
