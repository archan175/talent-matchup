import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockJobs, mockBids } from "@/lib/mock-data";
import { Briefcase, FileText, CheckCircle, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ERUKA" },
      { name: "description", content: "Manage your jobs, bids, and freelance career on ERUKA." },
    ],
  }),
  component: DashboardPage,
});

const statusStyles: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  "in-progress": "bg-warning/15 text-warning border-warning/30",
  completed: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/15 text-warning border-warning/30",
  accepted: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

function DashboardPage() {
  const [role, setRole] = useState<"freelancer" | "recruiter">("freelancer");

  const myBids = mockBids.filter((b) => b.freelancerId === "u1");
  const postedJobs = mockJobs;
  const activeJobs = mockJobs.filter((j) => j.status === "in-progress" && j.assignedFreelancerId === "u1");
  const completedJobs = mockJobs.filter((j) => j.status === "completed" && j.assignedFreelancerId === "u4");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back, Alex!</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={role === "freelancer" ? "default" : "secondary"}
            onClick={() => setRole("freelancer")}
          >
            Freelancer
          </Button>
          <Button
            size="sm"
            variant={role === "recruiter" ? "default" : "secondary"}
            onClick={() => setRole("recruiter")}
          >
            Recruiter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {role === "freelancer" ? (
          <>
            <StatCard icon={FileText} label="My Bids" value={myBids.length.toString()} />
            <StatCard icon={Briefcase} label="Active Jobs" value={activeJobs.length.toString()} />
            <StatCard icon={CheckCircle} label="Completed" value="47" />
            <StatCard icon={DollarSign} label="Total Earned" value="$84,200" />
          </>
        ) : (
          <>
            <StatCard icon={Briefcase} label="Posted Jobs" value={postedJobs.length.toString()} />
            <StatCard icon={Users} label="Total Bids" value={mockBids.length.toString()} />
            <StatCard icon={TrendingUp} label="In Progress" value={mockJobs.filter(j => j.status === "in-progress").length.toString()} />
            <StatCard icon={DollarSign} label="Total Spent" value="$156,000" />
          </>
        )}
      </div>

      {role === "freelancer" ? (
        <Tabs defaultValue="bids" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="bids">
            <div className="space-y-3">
              {myBids.map((bid) => {
                const job = mockJobs.find((j) => j.id === bid.jobId);
                return (
                  <Link key={bid.id} to="/jobs/$jobId" params={{ jobId: bid.jobId }}>
                    <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{job?.title}</h3>
                          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />${bid.amount.toLocaleString()}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{bid.deliveryTime} days</span>
                          </div>
                        </div>
                        <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="space-y-3">
              {activeJobs.length > 0 ? activeJobs.map((job) => (
                <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}>
                  <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">by {job.recruiterName}</p>
                      </div>
                      <Badge className={statusStyles[job.status]}>{job.status.replace("-", " ")}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <Card className="gradient-card border-border/50">
                  <CardContent className="p-8 text-center text-muted-foreground">No active jobs yet.</CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="gradient-card border-border/50">
              <CardContent className="p-8 text-center text-muted-foreground">
                You have completed 47 jobs. Keep up the great work!
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList className="bg-card border border-border/50">
            <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
            <TabsTrigger value="bids">Received Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="posted">
            <div className="space-y-3">
              {postedJobs.map((job) => (
                <Link key={job.id} to="/jobs/$jobId" params={{ jobId: job.id }}>
                  <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{job.bidsCount} bids</span>
                          <span>${job.budgetMin.toLocaleString()} – ${job.budgetMax.toLocaleString()}</span>
                        </div>
                      </div>
                      <Badge className={statusStyles[job.status]}>{job.status.replace("-", " ")}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bids">
            <div className="space-y-3">
              {mockBids.map((bid) => {
                const job = mockJobs.find((j) => j.id === bid.jobId);
                return (
                  <Card key={bid.id} className="gradient-card border-border/50">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{bid.freelancerName}</h3>
                        <p className="text-sm text-muted-foreground">on {job?.title} · ${bid.amount.toLocaleString()} · {bid.deliveryTime} days</p>
                      </div>
                      <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="gradient-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
