import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, DollarSign } from "lucide-react";
import type { Bid } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  accepted: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function BidCard({
  bid,
  isLowest,
  showActions,
  onAccept,
  onReject,
}: {
  bid: Bid;
  isLowest?: boolean;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  return (
    <Card className={`gradient-card border-border/50 ${isLowest ? "ring-1 ring-success/40" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {bid.freelancerAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{bid.freelancerName}</span>
                {isLowest && (
                  <Badge className="bg-success/15 text-success border-success/30 text-[10px]">
                    Lowest Bid
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>{bid.freelancerRating}</span>
              </div>
            </div>
          </div>
          <Badge className={`text-[10px] ${statusStyles[bid.status]}`}>
            {bid.status}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{bid.proposal}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">${bid.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{bid.deliveryTime} days</span>
            </div>
          </div>
          {showActions && bid.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" variant="success" onClick={onAccept}>Accept</Button>
              <Button size="sm" variant="destructive" onClick={onReject}>Reject</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
