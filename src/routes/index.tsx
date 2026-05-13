import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
  TrendingUp,
  Globe,
  CheckCircle,
  ChevronsDown,
} from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Index,
});

const stats = [
  { label: "Active Freelancers", value: "12K+", icon: Users },
  { label: "Jobs Completed", value: "45K+", icon: CheckCircle },
  { label: "Total Earnings Paid", value: "$28M+", icon: TrendingUp },
  { label: "Countries", value: "90+", icon: Globe },
];

const features = [
  {
    icon: Briefcase,
    title: "Smart Bidding",
    description:
      "Place competitive bids with proposal messages and delivery timelines. Our system highlights the best offers.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Escrow-protected payments ensure freelancers get paid and clients get quality work delivered.",
  },
  {
    icon: Zap,
    title: "Real-time Chat",
    description:
      "Communicate directly with clients and freelancers through our built-in messaging system.",
  },
  {
    icon: Star,
    title: "Rating System",
    description:
      "Build your reputation with verified reviews and ratings after each completed project.",
  },
];

function Index() {
  const navigate = useNavigate();
  const featuredJobs = mockJobs.filter((j) => j.status === "open").slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-xs">🚀 Trusted • Secure • Fast</Badge>
              <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl leading-tight">
                Hire top freelancers or find work — fast and confidently
              </h1>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Post projects, get curated bids, and manage work with built-in messaging and secure
                payments. A simple workflow for clients and freelancers.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      // eslint-disable-next-line no-console
                      console.debug('[ui] Hire Talent clicked');
                    } catch {}
                    void navigate({ to: "/post-job" });
                  }}
                >
                  Hire Talent
                </Button>

                <Link to="/jobs">
                  <Button variant="outline" className="rounded-md px-5 py-3">Find Work</Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">Active Freelancers</div>
                  <div className="text-lg font-bold text-secondary">12K+</div>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                  <div className="text-lg font-bold text-secondary">45K+</div>
                </div>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="rounded-card glass p-6 soft-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <svg viewBox="0 0 600 360" className="w-full h-52" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="h1" x1="0" x2="1">
                          <stop offset="0" stopColor="#2563EB" />
                          <stop offset="1" stopColor="#60A5FA" />
                        </linearGradient>
                      </defs>
                      <rect x="0" y="0" width="600" height="360" rx="12" fill="url(#h1)" opacity="0.12" />
                      <g transform="translate(30,30)">
                        <rect x="0" y="0" width="220" height="110" rx="10" fill="#fff" opacity="0.9" />
                        <rect x="240" y="10" width="300" height="40" rx="8" fill="#fff" opacity="0.9" />
                        <circle cx="40" cy="40" r="18" fill="#2563EB" />
                        <rect x="70" y="25" width="120" height="18" rx="6" fill="#F1F5F9" />
                        <rect x="70" y="48" width="80" height="12" rx="6" fill="#F1F5F9" />
                        <rect x="10" y="130" width="520" height="12" rx="6" fill="#fff" opacity="0.7" />
                        <rect x="10" y="150" width="320" height="12" rx="6" fill="#fff" opacity="0.7" />
                      </g>
                    </svg>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div className="rounded-md bg-white p-3 text-center">
                        <div className="text-xs text-muted-foreground">Avg Response</div>
                        <div className="text-sm font-semibold">2h</div>
                      </div>
                      <div className="rounded-md bg-white p-3 text-center">
                        <div className="text-xs text-muted-foreground">Payment Secure</div>
                        <div className="text-sm font-semibold">Escrow</div>
                      </div>
                      <div className="rounded-md bg-white p-3 text-center">
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                        <div className="text-sm font-semibold">4.8★</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Details */}
      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold">How it works</h3>
          <p className="text-sm text-muted-foreground">Three simple steps to hire or find work</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card-default p-6 text-center">
            <div className="text-2xl font-bold">1</div>
            <div className="mt-2 font-medium">Post Job</div>
            <div className="mt-1 text-sm text-muted-foreground">Describe your project and budget.</div>
          </div>
          <div className="card-default p-6 text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="mt-2 font-medium">Get Bids</div>
            <div className="mt-1 text-sm text-muted-foreground">Review proposals and timelines.</div>
          </div>
          <div className="card-default p-6 text-center">
            <div className="text-2xl font-bold">3</div>
            <div className="mt-2 font-medium">Hire</div>
            <div className="mt-1 text-sm text-muted-foreground">Choose the best freelancer and start work.</div>
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Freelancers</h3>
          <Link to="/jobs" className="text-sm text-primary">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* placeholder freelancer cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-default p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">Freelancer {i + 1}</div>
                  <div className="text-xs text-muted-foreground">Design · React · Figma</div>
                  <div className="text-xs text-muted-foreground mt-1">⭐ 4.{8 - i}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.62_0.21_255/0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-6 text-xs">
              🚀 Trusted by 12,000+ freelancers worldwide
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Build Projects Faster with the <span className="text-gradient">Right People</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              ERUKA connects freelancers and businesses through smart bidding, direct communication,
              and transparent collaboration from first message to final delivery.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/jobs">
                <Button variant="hero" size="lg" className="gap-2">
                  Browse Jobs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/post-job">
                <Button variant="outline" size="lg">
                  Post a Job
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="text-center"
              >
                <stat.icon className="mx-auto h-6 w-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose ERUKA?</h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to succeed as a freelancer or find the perfect talent.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <Card className="gradient-card border-border/50 h-full hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <motion.section
        className="mx-auto max-w-7xl px-4 pb-20 sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <p className="mt-2 text-muted-foreground">Latest opportunities waiting for your bid.</p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="border-t border-border/50"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Join thousands of freelancers and businesses building the future together.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/signup">
              <Button variant="hero" size="lg">
                Create Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
