import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Index,
});

const heroStats = [
  { label: "Reply rate", value: "96%" },
  { label: "Open jobs", value: "3.2K" },
  { label: "Avg rating", value: "4.8" },
];

const marketplaceMetrics = [
  { label: "Open work", value: "3,245", helper: "Ready for proposals", icon: Briefcase },
  { label: "In review", value: "842", helper: "Bids being compared", icon: Clock },
  { label: "Paid out", value: "$28M", helper: "Released to talent", icon: Wallet },
];

const stats = [
  { label: "Active freelancers", value: "12K+", icon: Users },
  { label: "Jobs completed", value: "45K+", icon: CheckCircle },
  { label: "Paid to talent", value: "$28M+", icon: TrendingUp },
  { label: "Countries", value: "90+", icon: Globe },
];

const features = [
  {
    icon: Briefcase,
    title: "Quality job posts",
    description: "Clear scopes, budgets, timelines, and skills keep every project easy to compare.",
  },
  {
    icon: Sparkles,
    title: "Smart bidding",
    description:
      "Freelancers can send focused proposals while clients review price and delivery fit.",
  },
  {
    icon: MessageSquare,
    title: "Built-in messages",
    description: "Keep project questions, updates, and approvals in one shared conversation.",
  },
  {
    icon: Shield,
    title: "Trusted workflow",
    description:
      "Profiles, status tracking, and saved records make work feel organized from day one.",
  },
];

const steps = [
  { title: "Post the work", text: "Describe the outcome, budget, deadline, and skills you need." },
  { title: "Compare bids", text: "Review proposals by price, timeline, profile, and project fit." },
  {
    title: "Start together",
    text: "Use messages and dashboard tracking to keep momentum visible.",
  },
];

const containerClass = "mx-auto max-w-[1200px] px-4 sm:px-6";
const sectionClass = `${containerClass} mt-16`;

function Index() {
  const featuredJobs = mockJobs.filter((job) => job.status === "open").slice(0, 3);

  return (
    <div className="overflow-x-hidden bg-background pb-16">
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className={`${containerClass} py-20`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[600px] flex-col items-center text-center"
          >
            <Badge
              variant="secondary"
              className="mb-6 rounded-xl border border-border/70 bg-white px-4 py-2 text-xs"
            >
              Freelance hiring, bidding, and work tracking
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              ERUKA connects the right talent with the right work.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
              A clean marketplace for posting projects, sending proposals, chatting with clients,
              and managing your work from one polished dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/post-job">
                <Button
                  size="lg"
                  variant="hero"
                  className="gap-2 px-6 transition hover:-translate-y-0.5"
                >
                  Hire Talent <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white px-6 transition hover:-translate-y-0.5"
                >
                  Find Work
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-[760px] grid-cols-1 gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <Card
                key={stat.label}
                className="rounded-xl border-border/70 bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <Card className="rounded-2xl border-border/70 bg-white shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge className="mb-3 border-success/30 bg-success/15 text-success">Live</Badge>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Marketplace pulse
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  A balanced view of active work, proposals, and payments without stretched or
                  overlapping panels.
                </p>
              </div>
              <Link to="/dashboard">
                <Button variant="outline" className="bg-white">
                  View Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marketplaceMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex min-h-32 items-start gap-4 rounded-xl border border-border/70 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{metric.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{metric.helper}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-border/70 bg-slate-950 p-6 text-white shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold">Hiring pipeline</p>
                    <p className="mt-1 text-sm text-white/60">Compact monthly performance</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div className="flex h-40 items-end gap-3">
                  {[42, 58, 49, 72, 66, 86, 78, 92].map((height, index) => (
                    <div
                      key={index}
                      className="min-w-0 flex-1 rounded-t-lg bg-gradient-to-t from-primary to-accent"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {featuredJobs.slice(0, 2).map((job) => (
                  <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                          {job.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {job.category} · {job.bidsCount} bids
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {job.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={sectionClass}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-xl border-border/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-foreground">How ERUKA works</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Simple enough to start today, structured enough to manage real projects.
            </p>
          </div>
          <Link to="/signup">
            <Button variant="outline" className="bg-white">
              Create Account
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="h-full rounded-xl border-border/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} rounded-2xl bg-white py-12`}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Built for both sides of the marketplace
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Clients get clarity. Freelancers get opportunity. Everyone gets fewer loose ends.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="h-full rounded-xl border-border/70 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured jobs</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Fresh opportunities ready for strong proposals.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section
        className={`${sectionClass} overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-sm`}
      >
        <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between lg:p-10">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Star className="h-4 w-4 text-accent" />
              Rated by freelancers and clients building real projects
            </div>
            <h2 className="max-w-2xl text-3xl font-bold">
              Start with one job, one bid, or one conversation.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/post-job">
              <Button variant="success" size="lg">
                Post a Job
              </Button>
            </Link>
            <Link to="/jobs">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-transparent text-white hover:bg-white hover:text-secondary"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
