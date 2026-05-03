import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, DollarSign, Users, ArrowDown } from "lucide-react";
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
      <Card className="group gradient-card border-border/50 transition-all duration-300 hover:border-primary/40 hover:glow-primary cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
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
        <CardContent className="space-y-3">
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

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{formatUsdAsInr(job.budgetMin)} – {formatUsdAsInr(job.budgetMax)}</span>
            </div>
            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
