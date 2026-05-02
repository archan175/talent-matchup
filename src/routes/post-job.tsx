import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Job — ERUKA" },
      { name: "description", content: "Post a freelance job on ERUKA and receive competitive bids from top talent." },
    ],
  }),
  component: PostJobPage,
});

function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
      <p className="text-muted-foreground mb-8">Fill in the details to attract the best freelancers.</p>

      <Card className="gradient-card border-border/50">
        <CardContent className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">Job Title</label>
            <Input
              placeholder="e.g. Build a Modern E-Commerce Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 bg-input/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              placeholder="Describe the project requirements, deliverables, and any specific technologies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Minimum Budget ($)</label>
              <Input type="number" placeholder="1000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className="mt-1 bg-input/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Maximum Budget ($)</label>
              <Input type="number" placeholder="5000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="mt-1 bg-input/50" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Deadline</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 bg-input/50" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-input/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select category</option>
                <option>Web Development</option>
                <option>AI & ML</option>
                <option>Design</option>
                <option>Data Engineering</option>
                <option>Mobile</option>
                <option>DevOps</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Required Skills</label>
            <div className="mt-1 flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                className="bg-input/50"
              />
              <Button variant="secondary" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button onClick={() => setSkills(skills.filter((s) => s !== skill))} className="rounded-full p-0.5 hover:bg-accent">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={() => alert("Job posted!")}>
            Post Job
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
