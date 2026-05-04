import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BidCard } from "@/components/BidCard";
import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";
import { fetchPostedJobs, fetchSavedBids, getAllBids, getAllJobs, saveBid } from "@/lib/local-data";
import { getCurrentUser } from "@/lib/auth";
import { formatUsdAsInr } from "@/lib/currency";
import { ArrowLeft, DollarSign, Clock, Users, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  head: ({ params }) => {
    const job = mockJobs.find((j) => j.id === params.jobId);
    return {
      meta: [
        { title: job ? `${job.title} — ERUKA` : "Job Not Found — ERUKA" },
        { name: "description", content: job?.description?.slice(0, 155) || "Job details on ERUKA" },
      ],
    };
  },
  component: JobDetailPage,
});

const statusStyles: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  "in-progress": "bg-warning/15 text-warning border-warning/30",
  completed: "bg-muted text-muted-foreground border-border",
};

function JobDetailPage() {
  const { jobId } = Route.useParams();
  const [jobs, setJobs] = useState<Job[]>(getAllJobs());
  const [allBids, setAllBids] = useState<Bid[]>(getAllBids());
  const job = jobs.find((j) => j.id === jobId);
  const bids = allBids.filter((b) => b.jobId === jobId);
  const lowestBid = bids.length > 0 ? Math.min(...bids.map((bid) => bid.amount)) : null;
  const lowestBidId = bids.length > 0 ? bids.reduce((a, b) => (a.amount < b.amount ? a : b)).id : null;

  const [bidOpen, setBidOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [bidDelivery, setBidDelivery] = useState("");

  useEffect(() => {
    void fetchPostedJobs().then((postedJobs) => {
      const postedIds = new Set(postedJobs.map((postedJob) => postedJob.id));
      setJobs([...postedJobs, ...mockJobs.filter((mockJob) => !postedIds.has(mockJob.id))]);
    });

    void fetchSavedBids().then((savedBids) => {
      const savedIds = new Set(savedBids.map((bid) => bid.id));
      setAllBids([...savedBids, ...mockBids.filter((bid) => !savedIds.has(bid.id))]);
    });
  }, []);

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-4 inline-block text-primary hover:underline">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/jobs" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
              <Badge className={`shrink-0 ${statusStyles[job.status]}`}>
                {job.status.replace("-", " ")}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Posted by {job.recruiterName} · {job.createdAt}
            </p>
          </div>

          <Card className="gradient-card border-border/50">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-3">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border/50">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bids Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Bids ({bids.length})
              {lowestBid && (
                <span className="ml-3 text-sm font-normal text-success">
                  Lowest: {formatUsdAsInr(lowestBid)}
                </span>
              )}
            </h2>
            {bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    isLowest={bid.id === lowestBidId}
                    showActions={true}
                    onAccept={async () => {
                      // mark bid accepted, others rejected, assign freelancer to job
                      const updatedBid = { ...bid, status: "accepted" } as const;
                      await import("@/lib/local-data").then((m) => m.upsertBid(updatedBid));

                      // update local state: mark other bids as rejected
                      setAllBids((current) => current.map((b) => (b.id === bid.id ? updatedBid : { ...b, status: b.id === bid.id ? "accepted" : "rejected" })));

                      // update job to assigned freelancer and status
                      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, assignedFreelancerId: bid.freelancerId, status: "in-progress" } : j)));
                      // persist job change
                      await import("@/lib/local-data").then((m) => m.savePostedJob({ ...(job as any), assignedFreelancerId: bid.freelancerId, status: "in-progress" }));

                      // refresh bids in UI
                      setAllBids((current) => current.map((b) => (b.id === bid.id ? { ...b, status: "accepted" } : b)));
                    }}
                    onReject={async () => {
                      const updatedBid = { ...bid, status: "rejected" } as const;
                      await import("@/lib/local-data").then((m) => m.upsertBid(updatedBid));
                      setAllBids((current) => current.map((b) => (b.id === bid.id ? updatedBid : b)));
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card className="gradient-card border-border/50">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No bids yet. Be the first to bid!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="gradient-card border-border/50 sticky top-20">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-lg font-bold">{formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="text-sm font-semibold">{job.deadline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Bids</p>
                  <p className="text-sm font-semibold">{bids.length} proposals</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold">{job.category}</p>
                </div>
              </div>

              {job.status === "open" && (
                <Button variant="hero" className="w-full" onClick={() => setBidOpen(true)}>
                  Place a Bid
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bid Modal */}
      <Dialog open={bidOpen} onOpenChange={setBidOpen}>
        <DialogContent className="gradient-card border-border/50">
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
            <DialogDescription>
              Submit your proposal for "{job.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Bid Amount (INR)</label>
              <Input
                type="number"
                placeholder="e.g. 250000"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mt-1 bg-input/50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Budget: {formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">Enter bid amount in INR.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Delivery Time (days)</label>
              <Input
                type="number"
                placeholder="e.g. 30"
                value={bidDelivery}
                onChange={(e) => setBidDelivery(e.target.value)}
                className="mt-1 bg-input/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Proposal</label>
              <textarea
                placeholder="Describe why you're the best fit..."
                value={bidProposal}
                onChange={(e) => setBidProposal(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBidOpen(false)}>Cancel</Button>
            <Button
              variant="hero"
              onClick={async () => {
                const currentUser = getCurrentUser();
                const amount = Math.round(Number(bidAmount) / 83);

                const newBid = {
                  id: `bid-${Date.now()}`,
                  jobId: job.id,
                  freelancerId: currentUser?.id || currentUser?.email || "guest-freelancer",
                  freelancerName: currentUser?.name || "Guest Freelancer",
                  freelancerRating: 0,
                  freelancerAvatar: (currentUser?.name || "GF")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase(),
                  amount,
                  proposal: bidProposal.trim(),
                  deliveryTime: Number(bidDelivery),
                  status: "pending",
                  createdAt: new Date().toISOString().slice(0, 10),
                } as const;

                await saveBid(newBid);
                setAllBids((currentBids) => [newBid, ...currentBids]);
                setBidAmount("");
                setBidProposal("");
                setBidDelivery("");
                setBidOpen(false);
              }}
              disabled={!bidAmount || !bidDelivery || !bidProposal.trim()}
            >
              Submit Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
