import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { categories, mockJobs, type Job } from "@/lib/mock-data";
import { fetchPostedJobs, getAllJobs } from "@/lib/local-data";
import { usdToInr } from "@/lib/currency";
import { Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Browse Jobs — ERUKA" },
      { name: "description", content: "Find freelance jobs in web development, AI, design, and more on ERUKA." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [jobs, setJobs] = useState<Job[]>(getAllJobs());

  useEffect(() => {
    void fetchPostedJobs().then((postedJobs) => {
      const postedIds = new Set(postedJobs.map((job) => job.id));
      setJobs([...postedJobs, ...mockJobs.filter((job) => !postedIds.has(job.id))]);
    });
  }, []);

  const filtered = jobs.filter((job) => {
    const budgetMinInr = usdToInr(job.budgetMin);
    const budgetMaxInr = usdToInr(job.budgetMax);
    const matchSearch = search === "" || job.title.toLowerCase().includes(search.toLowerCase()) || job.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category === "All" || job.category === category;
    const matchBudget = budgetFilter === "all" ||
      (budgetFilter === "low" && budgetMaxInr <= 200000) ||
      (budgetFilter === "mid" && budgetMinInr >= 200000 && budgetMaxInr <= 500000) ||
      (budgetFilter === "high" && budgetMinInr >= 500000);
    return matchSearch && matchCategory && matchBudget;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="mt-2 text-muted-foreground">Find your next freelance opportunity</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border rounded-md shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-border/50 bg-white px-3 py-2 text-sm text-foreground"
            >
              <option value="All">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="rounded-md border border-border/50 bg-white px-3 py-2 text-sm text-foreground"
            >
              <option value="all">All Budgets</option>
              <option value="low">Under Rs. 2L</option>
              <option value="mid">Rs. 2L - Rs. 5L</option>
              <option value="high">Rs. 5L+</option>
            </select>
            <Button size="sm" variant="outline">Rating</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={category === cat ? "default" : "secondary"}
              onClick={() => setCategory(cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No jobs match your filters.</p>
          <Button variant="ghost" className="mt-4" onClick={() => { setSearch(""); setCategory("All"); setBudgetFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
