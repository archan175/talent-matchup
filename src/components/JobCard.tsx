import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, Clock, Users } from "lucide-react";
import type { Job } from "@/lib/mock-data";
import { getLowestBid } from "@/lib/mock-data";
import { formatUsdAsInr } from "@/lib/currency";

const statusStyles: Record<string, string> = {
  open: "bg-success/15 text-success border-success/30",
  "in-progress": "bg-warning/15 text-warning border-warning/30",
  completed: "bg-muted text-muted-foreground border-border",
};

export function JobCard({ job }: { job: Job }) {
  const lowestBid = getLowestBid(job.id);

  return (
    <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
      <Card className="group h-full cursor-pointer rounded-xl border border-border/70 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {job.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                by {job.recruiterName} · {job.createdAt}
              </p>
            </div>
            <Badge className={`shrink-0 text-[10px] ${statusStyles[job.status]}`}>
              {job.status.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[10px]">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="secondary" className="text-[10px]">
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>

          <div className="mt-auto grid gap-4 border-t border-border/50 pt-4">
            <div className="text-sm font-semibold text-foreground">
              {formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {lowestBid && (
                <div className="flex items-center gap-1 text-xs text-success">
                  <ArrowDown className="h-3 w-3" />
                  <span>{formatUsdAsInr(lowestBid)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{job.bidsCount} bids</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{job.deadline}</span>
              </div>
              <span className="ml-auto rounded-md bg-primary px-3 py-1 text-sm text-white transition-opacity group-hover:opacity-90">
                Place bid
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
