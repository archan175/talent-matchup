import { mockBids, mockJobs, type Bid, type Job } from "@/lib/mock-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const JOBS_KEY = "eruka_posted_jobs";
const BIDS_KEY = "eruka_bids";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPostedJobs(): Job[] {
  return readJson<Job[]>(JOBS_KEY, []);
}

export async function fetchPostedJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured || !supabase) return getPostedJobs();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return getPostedJobs();

  return data.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    budgetMin: job.budget_min,
    budgetMax: job.budget_max,
    skills: job.skills || [],
    deadline: job.deadline,
    status: job.status,
    recruiterId: job.recruiter_id,
    recruiterName: job.recruiter_name,
    assignedFreelancerId: job.assigned_freelancer_id || undefined,
    createdAt: job.created_at?.slice(0, 10) || "",
    bidsCount: job.bids_count || 0,
    category: job.category,
  }));
}

export async function savePostedJob(job: Job) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("jobs").insert({
      id: job.id,
      title: job.title,
      description: job.description,
      budget_min: job.budgetMin,
      budget_max: job.budgetMax,
      skills: job.skills,
      deadline: job.deadline,
      status: job.status,
      recruiter_id: job.recruiterId,
      recruiter_name: job.recruiterName,
      assigned_freelancer_id: job.assignedFreelancerId || null,
      bids_count: job.bidsCount,
      category: job.category,
    });

    if (!error) return;
  }

  writeJson(JOBS_KEY, [job, ...getPostedJobs()]);
}

export function getAllJobs(): Job[] {
  return [...getPostedJobs(), ...mockJobs];
}

export function getSavedBids(): Bid[] {
  return readJson<Bid[]>(BIDS_KEY, []);
}

export async function fetchSavedBids(): Promise<Bid[]> {
  if (!isSupabaseConfigured || !supabase) return getSavedBids();

  const { data, error } = await supabase
    .from("bids")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return getSavedBids();

  return data.map((bid) => ({
    id: bid.id,
    jobId: bid.job_id,
    freelancerId: bid.freelancer_id,
    freelancerName: bid.freelancer_name,
    freelancerRating: bid.freelancer_rating,
    freelancerAvatar: bid.freelancer_avatar,
    amount: bid.amount,
    proposal: bid.proposal,
    deliveryTime: bid.delivery_time,
    status: bid.status,
    createdAt: bid.created_at?.slice(0, 10) || "",
  }));
}

export async function saveBid(bid: Bid) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("bids").insert({
      id: bid.id,
      job_id: bid.jobId,
      freelancer_id: bid.freelancerId,
      freelancer_name: bid.freelancerName,
      freelancer_rating: bid.freelancerRating,
      freelancer_avatar: bid.freelancerAvatar,
      amount: bid.amount,
      proposal: bid.proposal,
      delivery_time: bid.deliveryTime,
      status: bid.status,
    });

    if (!error) return;
  }

  writeJson(BIDS_KEY, [bid, ...getSavedBids()]);
}

export function getAllBids(): Bid[] {
  return [...getSavedBids(), ...mockBids];
}

export function getLowestStoredBid(jobId: string): number | null {
  const jobBids = getAllBids().filter((bid) => bid.jobId === jobId);
  if (jobBids.length === 0) return null;
  return Math.min(...jobBids.map((bid) => bid.amount));
}
