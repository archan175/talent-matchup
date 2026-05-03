import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, getRegisteredUsers } from "@/lib/auth";
import { getAllBids, getAllJobs, getPostedJobs, getSavedBids } from "@/lib/local-data";
import { formatUsdAsInr, usdToInr } from "@/lib/currency";
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  Activity,
  Target,
  Search,
  Bell,
  SlidersHorizontal,
  Send,
} from "lucide-react";

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
  const [selectedChatId, setSelectedChatId] = useState("c1");
  const [chatInput, setChatInput] = useState("");
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name || "Archan Patel";
  const allJobs = getAllJobs();
  const allBids = getAllBids();
  const postedJobRecords = getPostedJobs();
  const bidRecords = getSavedBids();
  const registeredUsers = getRegisteredUsers();
  const userKey = currentUser?.id || currentUser?.email || "u1";

  const myBids = allBids.filter((b) => b.freelancerId === userKey || (!currentUser && b.freelancerId === "u1"));
  const postedJobs = allJobs;
  const activeJobs = allJobs.filter((j) => j.status === "in-progress" && j.assignedFreelancerId === userKey);
  const completedJobs = allJobs.filter((j) => j.status === "completed");
  const bidsInReview = myBids.filter((bid) => bid.status === "pending").length;
  const totalBidValue = myBids.reduce((total, bid) => total + usdToInr(bid.amount), 0);
  const recruiterSpend = postedJobs.reduce((total, job) => total + usdToInr(job.budgetMax), 0);
  const inboxChats = [
    { id: "c1", name: "Aastha", username: "@aastha", message: "Hi Archan! I reviewed your proposal.", time: "2m", unread: 2 },
    { id: "c2", name: "Archan Patel", username: "@archanpatel", message: "Can you share final estimate by tonight?", time: "1h", unread: 1 },
    { id: "c3", name: "Zeel Patel", username: "@zeelpatel", message: "Please update milestone 2 delivery date.", time: "3h", unread: 0 },
    { id: "c4", name: "Aryan Patel", username: "@aryanpatel", message: "Great progress so far. Keep it up!", time: "Yesterday", unread: 0 },
  ];
  const [chatThreads, setChatThreads] = useState<Record<string, Array<{ sender: "me" | "them"; text: string; time: string }>>>({
    c1: [
      { sender: "them", text: "Hi Archan! I reviewed your proposal.", time: "2:10 PM" },
      { sender: "me", text: "Great, thanks. Happy to start immediately.", time: "2:12 PM" },
    ],
    c2: [
      { sender: "them", text: "Can you share final estimate by tonight?", time: "12:45 PM" },
      { sender: "me", text: "Yes, I will send a detailed estimate in an hour.", time: "12:47 PM" },
    ],
    c3: [{ sender: "them", text: "Please update milestone 2 delivery date.", time: "10:05 AM" }],
    c4: [{ sender: "them", text: "Great progress so far. Keep it up!", time: "Yesterday" }],
  });
  const activeChat = inboxChats.find((chat) => chat.id === selectedChatId) || inboxChats[0];
  const activeMessages = chatThreads[selectedChatId] || [];

  const handleSendMessage = () => {
    const content = chatInput.trim();
    if (!content) return;

    setChatThreads((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), { sender: "me", text: content, time: "Now" }],
    }));
    setChatInput("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {displayName}. Track work, finances, and activity in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">Response Rate 96%</Badge>
            <Badge variant="secondary">Profile Strength: Expert</Badge>
            <Badge variant="secondary">Last active: 5 min ago</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={role === "freelancer" ? "default" : "secondary"}
            onClick={() => setRole("freelancer")}
          >
            Freelancer
          </Button>
          <Button size="sm" variant={role === "recruiter" ? "default" : "secondary"} onClick={() => setRole("recruiter")}>
            Recruiter
          </Button>
          <Link to="/jobs">
            <Button size="sm" variant="outline" className="gap-1">
              Explore Jobs <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/post-job">
            <Button size="sm" variant="hero">
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {role === "freelancer" ? (
          <>
            <StatCard icon={FileText} label="My Bids" value={myBids.length.toString()} note={`${bidsInReview} pending`} />
            <StatCard icon={Briefcase} label="Active Jobs" value={activeJobs.length.toString()} note="Across 2 categories" />
            <StatCard icon={CheckCircle} label="Completed" value={completedJobs.length.toString()} note="Lifetime delivery" />
            <StatCard icon={DollarSign} label="Bid Value (INR)" value={formatInrCompact(totalBidValue)} note="Current pipeline" />
          </>
        ) : (
          <>
            <StatCard icon={Briefcase} label="Posted Jobs" value={postedJobs.length.toString()} note="All time" />
            <StatCard icon={Users} label="Total Bids" value={allBids.length.toString()} note="Across active jobs" />
            <StatCard
              icon={TrendingUp}
              label="In Progress"
              value={allJobs.filter((j) => j.status === "in-progress").length.toString()}
              note="Current engagements"
            />
            <StatCard icon={DollarSign} label="Projected Spend" value={formatInrCompact(recruiterSpend)} note="Budget ceiling" />
          </>
        )}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="gradient-card border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <MiniMetric title="Avg. Reply Time" value="35 min" icon={Clock} />
            <MiniMetric title="Success Score" value="98%" icon={Target} />
            <MiniMetric title="Weekly Activity" value="+14%" icon={Activity} />
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/profile">
              <Button variant="secondary" className="w-full justify-start">
                Update Profile
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="secondary" className="w-full justify-start">
                Open Messages
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="secondary" className="w-full justify-start">
                Review Opportunities
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card border-border/50 mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Stored Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logins" className="space-y-4">
            <TabsList className="bg-card border border-border/50">
              <TabsTrigger value="logins">Logins</TabsTrigger>
              <TabsTrigger value="jobs">Post Jobs</TabsTrigger>
              <TabsTrigger value="bids">Bids</TabsTrigger>
            </TabsList>

            <TabsContent value="logins">
              <div className="space-y-2">
                {registeredUsers.length > 0 ? registeredUsers.map((user) => (
                  <div key={user.email} className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">Email: {user.email}</p>
                    <p className="text-muted-foreground">Password: {user.password}</p>
                  </div>
                )) : (
                  <p className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm text-muted-foreground">
                    No signup records yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="jobs">
              <div className="space-y-2">
                {postedJobRecords.length > 0 ? postedJobRecords.map((job) => (
                  <div key={job.id} className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{job.title}</p>
                      <Badge className={statusStyles[job.status]}>{job.status}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">Recruiter: {job.recruiterName}</p>
                    <p className="text-muted-foreground">
                      Budget: {formatUsdAsInr(job.budgetMin)} - {formatUsdAsInr(job.budgetMax)}
                    </p>
                    <p className="text-muted-foreground">Category: {job.category} · Deadline: {job.deadline}</p>
                  </div>
                )) : (
                  <p className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm text-muted-foreground">
                    No posted job records yet.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bids">
              <div className="space-y-2">
                {bidRecords.length > 0 ? bidRecords.map((bid) => {
                  const job = allJobs.find((item) => item.id === bid.jobId);
                  return (
                    <div key={bid.id} className="rounded-lg border border-border/50 bg-card/40 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{bid.freelancerName}</p>
                        <Badge className={statusStyles[bid.status]}>{bid.status}</Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">Job: {job?.title || bid.jobId}</p>
                      <p className="text-muted-foreground">
                        Amount: {formatUsdAsInr(bid.amount)} · Delivery: {bid.deliveryTime} days
                      </p>
                      <p className="text-muted-foreground">Proposal: {bid.proposal}</p>
                    </div>
                  );
                }) : (
                  <p className="rounded-lg border border-border/50 bg-card/40 p-4 text-sm text-muted-foreground">
                    No bid records yet.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
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
                    const job = allJobs.find((j) => j.id === bid.jobId);
                    return (
                      <Link key={bid.id} to="/jobs/$jobId" params={{ jobId: bid.jobId }}>
                        <Card className="gradient-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{job?.title}</h3>
                              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{formatUsdAsInr(bid.amount)}</span>
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
                              <span>{formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}</span>
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
                  {allBids.map((bid) => {
                    const job = allJobs.find((j) => j.id === bid.jobId);
                    return (
                      <Card key={bid.id} className="gradient-card border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{bid.freelancerName}</h3>
                            <p className="text-sm text-muted-foreground">on {job?.title} · {formatUsdAsInr(bid.amount)} · {bid.deliveryTime} days</p>
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

        <Card className="gradient-card border-border/50 h-fit xl:sticky xl:top-20">
          <CardHeader className="border-b border-border/50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Messages</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search chats..." className="h-9 pl-9 bg-input/50" />
            </div>
            <div className="max-h-56 space-y-1 overflow-y-auto border-b border-border/50 pb-2">
              {inboxChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full rounded-lg p-2.5 text-left transition-colors hover:bg-accent/40 ${
                    selectedChatId === chat.id ? "bg-accent/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{chat.name}</p>
                        <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{chat.username}</p>
                      <p className="truncate text-xs text-foreground/90">{chat.message}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-lg border border-border/50 bg-card/30">
              <div className="border-b border-border/50 px-3 py-2">
                <p className="text-sm font-semibold">{activeChat.name}</p>
                <p className="text-[11px] text-muted-foreground">{activeChat.username}</p>
              </div>
              <div className="max-h-56 space-y-2 overflow-y-auto p-3">
                {activeMessages.map((message, index) => (
                  <div key={`${selectedChatId}-${index}`} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-2.5 py-2 text-xs ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-1 text-[10px] ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-border/50 p-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type message..."
                  className="h-8 bg-input/50 text-xs"
                />
                <Button type="submit" size="icon" className="h-8 w-8" disabled={!chatInput.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card className="gradient-card border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-[11px] text-muted-foreground/80">{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMetric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{title}</span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function formatInrCompact(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
