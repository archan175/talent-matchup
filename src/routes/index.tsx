import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
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
  const featuredJobs = mockJobs.filter((j) => j.status === "open").slice(0, 3);

  return (
    <div>
      {/* Intro */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.21_255/0.2),transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 text-center"
        >
          <h1 className="text-gradient text-6xl font-black tracking-tight sm:text-8xl lg:text-9xl">
            ERUKA
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Where talent meets opportunity. Scroll down to explore the platform.
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="mt-8 flex justify-center text-primary"
          >
            <ChevronsDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Hero Details */}
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
